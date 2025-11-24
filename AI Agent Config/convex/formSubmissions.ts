import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation to submit form data
export const submitForm = mutation({
  args: {
    section1: v.object({
      agentName: v.string(),
    }),
    section2: v.object({
      agentDescription: v.string(),
    }),
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
    contact: v.object({
      fullName: v.string(),
      email: v.string(),
      phone: v.string(),
      companyName: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    // Save to database
    const submissionId = await ctx.db.insert("formSubmissions", {
      ...args,
      submittedAt: Date.now(),
      webhookSent: false,
    });

    // Send to Make.com webhook
    try {
      const webhookUrl = "https://hook.eu1.make.com/3h2st6ogifu7hpedypsykssgthoehlms";

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submissionId,
          ...args,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.statusText}`);
      }

      // Update record to mark webhook as sent
      await ctx.db.patch(submissionId, {
        webhookSent: true,
      });

      return { success: true, submissionId };
    } catch (error) {
      // Log webhook error but don't fail the submission
      await ctx.db.patch(submissionId, {
        webhookSent: false,
        webhookError: error instanceof Error ? error.message : "Unknown error",
      });

      return {
        success: true,
        submissionId,
        webhookError: "Form saved but webhook failed"
      };
    }
  },
});

// Query to get all submissions (for admin purposes)
export const getAllSubmissions = query({
  handler: async (ctx) => {
    return await ctx.db.query("formSubmissions").order("desc").collect();
  },
});

// Query to get a specific submission
export const getSubmission = query({
  args: { id: v.id("formSubmissions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
