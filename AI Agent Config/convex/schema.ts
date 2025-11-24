import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  formSubmissions: defineTable({
    // Section 1: Agent Name
    section1: v.object({
      agentName: v.string(),
    }),
    // Section 2: Agent Description
    section2: v.object({
      agentDescription: v.string(),
    }),
    // Section 3: Persona & Role
    section3: v.object({
      role: v.string(),
      responsibilities: v.array(v.string()),
      responseStyle: v.object({
        tone: v.string(),
        language: v.string(),
        otherLanguage: v.optional(v.string()),
        emojiUsage: v.string(),
        responseLength: v.string(),
      }),
      personalityTraitsPreset: v.optional(v.string()),
      personalityTraitsCustom: v.optional(v.string()),
    }),
    // Section 4: Skills & Capabilities
    section4: v.object({
      coreCapabilities: v.object({
        faq: v.boolean(),
        leadGeneration: v.boolean(),
        orderProcessing: v.boolean(),
        productRecommendations: v.boolean(),
        technicalSupport: v.boolean(),
        scheduling: v.boolean(),
        humanEscalation: v.boolean(),
        other: v.boolean(),
        otherText: v.optional(v.string()),
      }),
      workflows: v.object({
        greeting: v.string(),
        helpRequest: v.string(),
        cannotHelp: v.string(),
        frustrated: v.string(),
        additional: v.optional(v.string()),
      }),
    }),
    // Section 5: Product & Service Information
    section5: v.object({
      aboutBusiness: v.optional(v.string()),
      aboutBusinessUrl: v.optional(v.string()),
      productsOverview: v.string(),
      specifications: v.optional(v.string()),
      pricing: v.optional(v.string()),
      bookingOptions: v.optional(v.string()),
      references: v.optional(v.array(v.string())),
      separateDocumentation: v.boolean(),
    }),
    // Section 6: Constraints & Limitations
    section6: v.object({
      shouldDiscuss: v.string(),
      shouldNotDiscuss: v.string(),
      confidentialInfo: v.optional(v.string()),
      behavioralRestrictions: v.object({
        noDeliveryPromises: v.boolean(),
        noLegalMedicalFinancialAdvice: v.boolean(),
        noCompetitorDiscussion: v.boolean(),
        noPricingWithoutApproval: v.boolean(),
        other: v.boolean(),
        otherText: v.optional(v.string()),
      }),
      escalationRules: v.string(),
    }),
    // Contact Information
    contact: v.object({
      fullName: v.string(),
      email: v.string(),
      phone: v.string(),
      companyName: v.string(),
    }),
    // Metadata
    submittedAt: v.number(),
    webhookSent: v.boolean(),
    webhookError: v.optional(v.string()),
  }),
});
