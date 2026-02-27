import { config } from 'dotenv';
config();

import '@/ai/schemas.ts';
import '@/ai/flows/simplify-paragraph.ts';
import '@/ai/flows/generate-post-assist.ts';
import '@/ai/flows/check-grammar.ts';
