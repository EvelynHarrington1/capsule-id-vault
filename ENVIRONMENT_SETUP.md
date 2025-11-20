# Environment Configuration Guide for Capsule ID Vault

## Overview

This guide covers all environment variables and configuration options for the Capsule ID Vault application.

## Required Environment Variables

### Frontend Configuration (.env.local)

```bash
# Contract Address (after deployment)
VITE_HEALTH_METRICS_CONTRACT_ADDRESS=0x...

# WalletConnect Project ID
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Network Configuration
VITE_SUPPORTED_CHAIN_IDS=31337,11155111,8009
VITE_DEFAULT_CHAIN_ID=31337
```

### Backend/Deployment Configuration (.env)

```bash
# Private Keys (for deployment)
PRIVATE_KEY=0x...
MNEMONIC="your mnemonic phrase"

# API Keys
INFURA_API_KEY=your_infura_key
ETHERSCAN_API_KEY=your_etherscan_key

# RPC URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
ZAMA_RPC_URL=https://devnet.zama.ai
```

## Network Configuration

### Supported Networks

| Network | Chain ID | RPC URL | Gas Price |
|---------|----------|---------|-----------|
| Hardhat (Local) | 31337 | http://localhost:8545 | Auto |
| Sepolia | 11155111 | https://sepolia.infura.io/v3/... | 20 gwei |
| Zama Devnet | 8009 | https://devnet.zama.ai | 1 gwei |

### FHEVM Configuration

```bash
# FHEVM Settings
VITE_FHEVM_RELAY_ENABLED=true
VITE_FHEVM_RELAY_URL=https://relayer.zama.ai
VITE_FHEVM_NETWORK_ID=8009
VITE_FHE_SECURITY_BITS=128
VITE_FHE_MAX_BATCH_SIZE=10
```

## Feature Flags

### Application Features

```bash
# Core Features
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_ENABLE_DATA_EXPORT=true
VITE_ENABLE_DEBUG_MODE=false

# Security Features
VITE_ENABLE_INPUT_VALIDATION=true
VITE_CSP_ENABLED=true
VITE_RATE_LIMIT_REQUESTS_PER_MINUTE=10
```

### UI Configuration

```bash
# Application Info
VITE_APP_NAME=Capsule ID Vault
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Encrypted Mental Health Survey DApp

# Data Limits
VITE_MAX_EXPORT_RECORDS=1000
VITE_MAX_FILE_SIZE_MB=10
```

## Development Configuration

### Logging and Debugging

```bash
# Logging
VITE_LOG_LEVEL=info
VITE_ENABLE_CONSOLE_LOGGING=true

# Performance
VITE_PERFORMANCE_SAMPLE_RATE=0.1
VITE_PERFORMANCE_MAX_METRICS=100

# Development Mode
NODE_ENV=development
VITE_NODE_ENV=development
```

### API Configuration

```bash
# Future Backend API
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=30000
```

## Monitoring and Analytics

### Performance Monitoring

```bash
VITE_PERFORMANCE_SAMPLE_RATE=0.1
VITE_PERFORMANCE_MAX_METRICS=100
```

### Error Tracking

```bash
VITE_ERROR_TRACKING_ENABLED=true
VITE_ERROR_TRACKING_DSN=your_error_tracking_dsn
```

### Analytics

```bash
VITE_ANALYTICS_ENABLED=false
VITE_ANALYTICS_TRACKING_ID=your_analytics_id
```

## Third-Party Integrations

### Social Sharing

```bash
VITE_SHARE_URL=https://capsule-id.vercel.app
VITE_SHARE_TITLE=Capsule ID Vault - Privacy-First Health Analytics
VITE_SHARE_DESCRIPTION=Secure mental health surveys with FHE
```

### Documentation and Support

```bash
VITE_DOCS_URL=https://docs.capsule-id.com
VITE_PRIVACY_POLICY_URL=https://capsule-id.com/privacy
VITE_TERMS_OF_SERVICE_URL=https://capsule-id.com/terms
VITE_SUPPORT_EMAIL=support@capsule-id.com
VITE_DISCORD_URL=https://discord.gg/capsule-id
VITE_GITHUB_URL=https://github.com/EvelynHarrington1/capsule-id-vault
```

## Gas Configuration

### Gas Price Settings

```bash
# Gas prices in wei
GAS_PRICE_SEPOLIA=20000000000
GAS_PRICE_ZAMA=1000000000
GAS_LIMIT_DEPLOYMENT=8000000
```

## Security Considerations

### Rate Limiting

```bash
VITE_RATE_LIMIT_REQUESTS_PER_MINUTE=10
VITE_RATE_LIMIT_WINDOW_MS=60000
```

### Input Validation

```bash
VITE_ENABLE_INPUT_VALIDATION=true
VITE_MAX_FILE_SIZE_MB=10
```

## Deployment Checklist

Before deploying to production, ensure:

1. ✅ All required environment variables are set
2. ✅ Contract addresses are updated after deployment
3. ✅ API keys are valid and have appropriate permissions
4. ✅ Network configurations match target environment
5. ✅ Feature flags are set correctly
6. ✅ Security settings are enabled
7. ✅ Monitoring and error tracking are configured

## Environment File Templates

### .env.local (Frontend)

```bash
VITE_HEALTH_METRICS_CONTRACT_ADDRESS=0x...
VITE_WALLETCONNECT_PROJECT_ID=...
VITE_SUPPORTED_CHAIN_IDS=31337,11155111,8009
VITE_DEFAULT_CHAIN_ID=31337
```

### .env (Deployment)

```bash
PRIVATE_KEY=0x...
MNEMONIC="..."
INFURA_API_KEY=...
ETHERSCAN_API_KEY=...
GAS_PRICE_SEPOLIA=20000000000
GAS_PRICE_ZAMA=1000000000
```

## Troubleshooting

### Common Issues

1. **Contract not found**: Check `VITE_HEALTH_METRICS_CONTRACT_ADDRESS`
2. **Wallet connection failed**: Verify `VITE_WALLETCONNECT_PROJECT_ID`
3. **Network errors**: Check RPC URLs and network configurations
4. **FHE operations failed**: Verify FHEVM configuration and relayer settings

### Debug Mode

Enable debug mode to see detailed logs:

```bash
VITE_ENABLE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
VITE_ENABLE_CONSOLE_LOGGING=true
```

## Support

For configuration issues, check:
- This documentation
- GitHub Issues: https://github.com/EvelynHarrington1/capsule-id-vault/issues
- Discord: https://discord.gg/capsule-id
