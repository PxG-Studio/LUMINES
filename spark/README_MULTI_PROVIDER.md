# SPARK Multi-Provider AI Integration

## Overview

SPARK now supports multiple AI providers, giving you the flexibility to choose between Claude (Anthropic) and GPT-4 (OpenAI) for Unity C# script generation.

## Supported Providers

### Claude (Anthropic)
- **Model**: claude-sonnet-3-5-20241022
- **Strengths**: Excellent code generation, detailed understanding, strong reasoning
- **Cost**: ~$3 per million input tokens, ~$15 per million output tokens
- **Get API Key**: https://console.anthropic.com/

### GPT-4 (OpenAI)
- **Model**: gpt-4
- **Strengths**: Versatile, well-tested, broad knowledge base
- **Cost**: ~$30 per million input tokens, ~$60 per million output tokens
- **Get API Key**: https://platform.openai.com/api-keys

## Setup Instructions

### 1. Install Dependencies

```bash
cd spark
npm install
```

### 2. Configure API Keys

Create a `.env.local` file in the `spark` directory:

```env
# Claude API Key (optional - only needed if using Claude)
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx

# OpenAI API Key (optional - only needed if using OpenAI)
OPENAI_API_KEY=sk-xxxxx

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note**: You only need to configure the API key for the provider(s) you plan to use.

### 3. Start Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000/spark`

## Using the System

### Provider Selection

1. Open SPARK at `/spark`
2. Use the dropdown at the top of the chat panel to select your preferred AI provider
3. Choose between:
   - **Claude (Anthropic)** - Default provider
   - **GPT-4 (OpenAI)** - Alternative provider

### Generating Scripts

1. Select your preferred AI provider
2. Type your Unity script request in the chat input
3. Press "Generate" or hit Enter
4. The generated C# script will appear in the preview panel
5. Use the "Export" button to download your script

### Example Prompts

- "Create a player controller with WASD movement and jumping"
- "Generate an inventory system with add, remove, and display items"
- "Make a health system with damage, healing, and death events"
- "Create a camera follow script with smooth damping"

## Architecture

### File Structure

```
spark/
├── app/
│   └── spark/
│       ├── actions/
│       │   └── generate.ts          # Main generation orchestrator
│       └── components/
│           ├── MCPChat.tsx           # Chat UI with provider selection
│           └── PreviewPanel.tsx      # Code preview and export
├── lib/
│   ├── ai/
│   │   ├── claude-client.ts         # Claude/Anthropic integration
│   │   └── openai-client.ts         # OpenAI integration
│   └── unity/
│       └── validator.ts             # C# code validation
└── .env.local                       # API keys (create this)
```

### How It Works

1. **Provider Selection**: User selects AI provider via dropdown
2. **Request Routing**: `generateUnityScript()` routes to appropriate client
3. **Code Generation**: Provider-specific client calls AI API
4. **Validation**: Generated code is validated for C# syntax
5. **Preview**: Valid code is displayed in Monaco editor
6. **Export**: User can download as `.cs` file

### Code Flow

```
MCPChat (UI)
    ↓
generateUnityScript (orchestrator)
    ↓
    ├─→ generateWithClaude (if Claude selected)
    └─→ generateWithOpenAI (if OpenAI selected)
    ↓
validateCSharp (validation)
    ↓
PreviewPanel (display)
```

## Error Handling

The system handles various error scenarios:

- **Missing API Key**: Clear message indicating which key is needed
- **API Errors**: Network issues, rate limits, invalid responses
- **Validation Errors**: Invalid C# syntax in generated code
- **Timeout Errors**: Long-running generation requests

## Best Practices

### Cost Management

- **Claude** is generally more cost-effective for code generation
- **GPT-4** is more expensive but may be preferred for specific use cases
- Monitor your API usage in the respective dashboards

### Quality Optimization

- Be specific in your prompts
- Include details about Unity version, dependencies, or specific requirements
- Iterate on generated code by refining your prompts

### Security

- Never commit `.env.local` to version control
- Rotate API keys regularly
- Use environment variables for all sensitive data
- Set spending limits in your provider dashboards

## Troubleshooting

### "API key not configured" Error

**Solution**: Add the required API key to `.env.local` and restart the dev server

### "Generated code has errors" Message

**Solution**:
- Try regenerating with a more specific prompt
- Switch to the alternative provider
- Manually fix validation errors in the preview

### Rate Limiting

**Solution**:
- Wait a few moments and try again
- Consider upgrading your API plan
- Switch to the alternative provider temporarily

### Build Errors

**Solution**:
```bash
# Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## API Limits

### Claude (Anthropic)
- Rate limits vary by plan
- Default: 50 requests per minute
- Check: https://console.anthropic.com/settings/limits

### OpenAI
- Rate limits vary by plan
- Default: 3 requests per minute (free tier)
- Check: https://platform.openai.com/account/rate-limits

## Future Enhancements

Planned features:
- Model selection (Sonnet vs Haiku, GPT-4 vs GPT-3.5)
- Usage statistics and cost tracking
- Provider preference persistence
- Conversation history
- Multi-file project generation
- Custom system prompts
- Fine-tuned models for Unity

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review provider documentation
3. Check API status pages
4. Review application logs

## License

See main project LICENSE file.
