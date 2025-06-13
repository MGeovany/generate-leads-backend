import { Injectable, Logger } from '@nestjs/common';
import { OpenAI } from 'openai';
import { env } from 'src/config/env';
import { AI_TAGS, AiTag } from 'src/constants/ai-tags';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }

  async simulateResponse(
    text: string,
    profile: {
      aiTone?: string;
      accountType?: string;
      customAccountType?: string;
      audienceStyle?: string;
    },
  ): Promise<{ response: string; isAiGenerated: boolean }> {
    try {
      const tone = profile.aiTone || 'friendly';
      const account =
        profile.customAccountType || profile.accountType || 'Instagram creator';
      const style = profile.audienceStyle || 'friendly';

      const prompt = `
Act as a ${account} who manages an Instagram account and replies to DMs using a ${tone} tone.
You usually communicate with your followers in a ${style} way.
The incoming message is: "${text}"
Reply clearly, naturally, and in your brand's voice.
If the message seems like a request for information or content, include a link.

Your response:
`;
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini', // Using cheaper model to reduce quota usage
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 100,
      });

      const response =
        completion.choices[0].message.content ??
        'Lo siento, no pude generar una respuesta.';

      return { response, isAiGenerated: true };
    } catch (error) {
      this.logger.error('OpenAI API Error:', error.message);

      // Handle quota exceeded and other OpenAI errors
      if (error.status === 429) {
        this.logger.warn('OpenAI quota exceeded, using fallback response');
        return this.getFallbackResponse(text);
      }

      if (error.status === 401) {
        this.logger.error('OpenAI API key is invalid');
        return this.getFallbackResponse(text);
      }

      // For any other error, use fallback
      this.logger.error('Unexpected OpenAI error, using fallback response');
      return this.getFallbackResponse(text);
    }
  }

  public getFallbackResponse(text: string): {
    response: string;
    isAiGenerated: boolean;
  } {
    // Simple rule-based responses as fallback
    const lowerText = text.toLowerCase();

    if (
      lowerText.includes('hola') ||
      lowerText.includes('hi') ||
      lowerText.includes('hello')
    ) {
      return {
        response:
          '¡Hola! 👋 Gracias por escribirme. ¿En qué puedo ayudarte hoy?',
        isAiGenerated: false,
      };
    }

    if (
      lowerText.includes('precio') ||
      lowerText.includes('costo') ||
      lowerText.includes('cuánto')
    ) {
      return {
        response:
          '¡Hola! Me alegra que estés interesado/a. Te envío la información por DM para que puedas revisar todas las opciones disponibles. 📩',
        isAiGenerated: false,
      };
    }

    if (
      lowerText.includes('info') ||
      lowerText.includes('información') ||
      lowerText.includes('details')
    ) {
      return {
        response:
          '¡Perfecto! Te envío toda la información que necesitas. Si tienes alguna pregunta específica, no dudes en escribirme. 😊',
        isAiGenerated: false,
      };
    }

    if (
      lowerText.includes('gracias') ||
      lowerText.includes('thanks') ||
      lowerText.includes('thank you')
    ) {
      return {
        response:
          '¡De nada! 😊 Estoy aquí para ayudarte con lo que necesites. ¡Que tengas un excelente día!',
        isAiGenerated: false,
      };
    }

    // Default fallback response
    return {
      response:
        '¡Hola! Gracias por tu mensaje. En este momento estoy experimentando algunos problemas técnicos, pero te responderé personalmente muy pronto. ¡Gracias por tu paciencia! 😊',
      isAiGenerated: false,
    };
  }

  async classify(text: string): Promise<AiTag> {
    const prompt = `
You are a message classification assistant.
Classify the following message into one of these categories:
- greeting
- pricing_request
- info_request
- complaint
- thanks
- spam
- other

Message: "${text}"
Just respond with the category, nothing else.
`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
      max_tokens: 10,
    });

    const tag = completion.choices[0].message.content?.trim().toLowerCase();

    if (AI_TAGS.includes(tag as AiTag)) return tag as AiTag;

    return 'other';
  }
}
