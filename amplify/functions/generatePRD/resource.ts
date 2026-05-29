import { defineFunction } from '@aws-amplify/backend';

export const generatePRD = defineFunction({
    name: 'generatePRD',
    entry: './handler.ts',
    timeoutSeconds: 300,
    environment: {
        BEDROCK_REGION: 'us-east-2',
    },
});