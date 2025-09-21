const { Client, Collection, GatewayIntentBits, REST, Routes, MessageFlags } = require('discord.js');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Load configuration
const config = yaml.load(fs.readFileSync('./config.yml', 'utf8'));

// Create a new client instance
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages
    ] 
});

// Create a collection to store commands
client.commands = new Collection();
const commands = [];

// Load commands
const commandsPath = path.join(__dirname, 'commands');
if (!fs.existsSync(commandsPath)) {
    fs.mkdirSync(commandsPath);
}

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
        console.log(`[INFO] Loaded command: ${command.data.name}`);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Function to deploy commands to a guild
async function deployCommandsToGuild(guildId) {
    try {
        const rest = new REST().setToken(config.botToken);
        
        console.log(`[INFO] Started refreshing ${commands.length} application (/) commands for guild ${guildId}.`);
        
        const data = await rest.put(
            Routes.applicationGuildCommands(config.clientId, guildId),
            { body: commands },
        );
        
        console.log(`[SUCCESS] Successfully reloaded ${data.length} application (/) commands for guild ${guildId}.`);
    } catch (error) {
        console.error(`[ERROR] Failed to deploy commands to guild ${guildId}:`, error);
    }
}

// Function to deploy commands globally
async function deployCommandsGlobally() {
    try {
        const rest = new REST().setToken(config.botToken);
        
        console.log(`[INFO] Started refreshing ${commands.length} global application (/) commands.`);
        
        const data = await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands },
        );
        
        console.log(`[SUCCESS] Successfully reloaded ${data.length} global application (/) commands.`);
        console.log('[INFO] Global commands may take up to 1 hour to appear in all servers.');
    } catch (error) {
        console.error('[ERROR] Failed to deploy global commands:', error);
    }
}

// When the client is ready, run this code (only once)
client.once('clientReady', async () => {
    console.log(`[INFO] Bot is ready! Logged in as ${client.user.tag}`);
    console.log(`[INFO] Bot is in ${client.guilds.cache.size} guild(s)`);
    
    // Set bot status
    if (config.botStatus) {
        client.user.setActivity(config.botStatus.activity, { type: config.botStatus.type });
    }
    
    // Deploy commands on startup
    if (config.guildId) {
        // Deploy to specific guild (faster)
        await deployCommandsToGuild(config.guildId);
    } else {
        // Deploy to all guilds the bot is in
        for (const guild of client.guilds.cache.values()) {
            await deployCommandsToGuild(guild.id);
        }
    }
});

// Handle when bot joins a new guild
client.on('guildCreate', async (guild) => {
    console.log(`[INFO] Bot joined new guild: ${guild.name} (${guild.id})`);
    await deployCommandsToGuild(guild.id);
});

// Handle slash command interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`[ERROR] No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(`[ERROR] Error executing command ${interaction.commandName}:`, error);
        
        const errorMessage = { content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral };
        
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMessage);
        } else {
            await interaction.reply(errorMessage);
        }
    }
});

// Handle errors
client.on('error', error => {
    console.error('[ERROR] Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('[ERROR] Unhandled promise rejection:', error);
});

// Login to Discord with your client's token
client.login(config.botToken);
