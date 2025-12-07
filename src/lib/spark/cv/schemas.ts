/**
 * Computer Vision / ASR Zod Schemas
 *
 * Validation for OCR, OCV, image classification, and audio transcription
 */

import { z } from "zod";

const pathUnderUploadsOrAssets = z.string().regex(/^(Assets|Uploads)\//, "path must be under Assets/ or Uploads/");
const imageMime = z.enum(["image/png", "image/jpeg", "image/webp"]);
const pdfMime = z.literal("application/pdf");
const audioMime = z.enum(["audio/wav", "audio/mpeg", "audio/ogg", "audio/flac"]);

export const zOcrRequest = z.object({
  path: pathUnderUploadsOrAssets,
  mime: z.union([imageMime, pdfMime]),
  maxPages: z.number().int().positive().max(10).default(5),
});

export const zOcvRequest = z.object({
  path: pathUnderUploadsOrAssets,
  mime: z.union([imageMime, pdfMime]),
  pattern: z.string().min(1),
  maxPages: z.number().int().positive().max(3).default(1),
});

export const zClassifyRequest = z.object({
  path: pathUnderUploadsOrAssets,
  mime: imageMime,
  mode: z.enum(["fast", "accurate"]).default("fast"),
});

export const zAsrRequest = z.object({
  path: pathUnderUploadsOrAssets,
  mime: audioMime,
  language: z.string().optional(),
  maxDurationSec: z.number().int().positive().max(900).default(300),
});
