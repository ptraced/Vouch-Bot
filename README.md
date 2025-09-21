# Vouch Bot

A Discord bot for managing user vouches and reviews with star ratings and customizable embeds.

## Features

- **Slash Commands**: Modern Discord slash command interface
- **Star Ratings**: 1-5 star rating system with visual stars
- **User-Specific Vouching**: Option to vouch for specific users or the business as a whole
- **Image Attachments**: Optional image upload for proof/evidence
- **Role Restrictions**: Limit vouch command usage to specific roles
- **Customizable Embeds**: Fully customizable embed colors, titles, and field names
- **Vouch Counter**: Automatic numbering of vouches
- **Persistent Data**: Vouch count stored in JSON file

## Setup

### Prerequisites

- Node.js 22.14.0 or higher
- A Discord bot token and application
- Discord server with appropriate permissions

### Installation

1. **Clone or download this repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the bot**
   
   Edit `config.yml` and replace the placeholder values:
   
   ```yaml
   # Bot Configuration
   botToken: "YOUR_BOT_TOKEN_HERE"     # Your Discord bot token
   clientId: "YOUR_CLIENT_ID_HERE"     # Your Discord application/client ID
   guildId: "YOUR_GUILD_ID_HERE"       # Your Discord server ID (optional)
   
   # Other settings
   vouchChannelId: "CHANNEL_ID_HERE"   # Channel where vouches will be sent
   requiredRoles: ["ROLE_ID_1", "ROLE_ID_2"]  # Roles that can use vouch command
   ```

4. **Start the bot**
   ```bash
   npm start
   ```

### Getting Discord IDs

To get the required IDs:

1. **Bot Token & Client ID**: 
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application or select existing one
   - Go to "Bot" section for the token
   - Go to "General Information" for the Client ID

2. **Guild ID (Server ID)**:
   - Enable Developer Mode in Discord settings
   - Right-click your server → "Copy Server ID"

3. **Channel ID**:
   - Right-click the channel → "Copy Channel ID"

4. **Role ID**:
   - Right-click the role → "Copy Role ID"

### Bot Permissions

Your bot needs the following permissions:
- Send Messages
- Use Slash Commands
- Embed Links
- Attach Files (if image uploads are enabled)
- Read Message History

## Configuration Options

### Basic Settings

- `allowUserSpecificVouch`: Allow vouching for specific users (true/false)
- `uploadImage`: Require image attachments for vouches (true/false)
- `requiredRoles`: Array of role IDs that can use the vouch command

### Customization

All embed elements can be customized in the `customization` section:

```yaml
customization:
  embedColor: "#5e99ff"
  vouchTitle: "🎉 Vouch (#${count})"
  vouchFooterText: "Vouched by ${authorTag}"
  userFieldTitle: "Vouched User"
  vouchedByFieldTitle: "Vouched By"
  vouchedAtFieldTitle: "Vouched at"
  starsFieldTitle: "Stars"
  messageDescription: "${messageContent}"
```

### Bot Status

Configure the bot's activity status:

```yaml
botStatus:
  activity: "Managing vouches"
  type: 0  # 0 = Playing, 1 = Streaming, 2 = Listening, 3 = Watching, 5 = Competing
```

## Usage

### /vouch Command

Users with the required roles can use the `/vouch` command with the following options:

- **message** (required): The vouch message/review
- **stars** (required): Rating from 1-5 stars
- **user** (optional): The user being vouched for (if enabled in config)
- **attachment** (optional): Image proof (if enabled in config)

## File Structure

```
vouch-bot/
├── commands/
│   └── vouch.js          # Vouch command implementation
├── config.yml            # Bot configuration
├── vouchCount.json       # Persistent vouch counter
├── index.js              # Main bot file
├── deploy-commands.js    # Command deployment script
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## Development

For development with auto-restart:
```bash
npm run dev
```

## Support

If you encounter any issues:
1. Check that all IDs in `config.yml` are correct
2. Ensure the bot has proper permissions in your server
3. Verify that slash commands were deployed successfully
4. Check the console for error messages