# Installation Instructions

The OpenAI package has been added to `package.json`. To install it, run:

```bash
cd ~/Developer/trip-receipt-manager
pnpm install
```

After installing, make sure to add your OpenAI API key to the `.env` file:

```
OPENAI_API_KEY=your_openai_api_key_here
```

Get your API key from: https://platform.openai.com/api-keys

Then restart the dev server with `pnpm dev`.

