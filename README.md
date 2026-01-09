# AutoMatTuner

AutoMatTuner is a modern, AI-enhanced frontend for Intune automation. It features real-time upload monitoring, log analysis, and a Gemini-powered AI assistant for generating PowerShell detection scripts.

## 🚀 Deploy to Azure

You can deploy this application directly to your Azure subscription using the button below.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAyoub-Sekoum%2Fautomattuner%2Fmain%2Fazuredeploy.json)

## ✨ Features

*   **Real-time Monitoring**: Visualize application packaging and upload status.
*   **AI Architect**: Use natural language to generate Intune detection scripts (PowerShell) powered by Google Gemini.
*   **Log Analysis**: Automatic error log analysis and root cause suggestions.
*   **Secure**: Designed for Azure AD authentication and Key Vault integration.

## 🛠 Local Development

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## 🐳 Docker Build

To build the production container locally:

```bash
docker build -t automattuner .
docker run -p 8080:80 automattuner
```
