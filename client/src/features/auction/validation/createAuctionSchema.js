import { z } from 'zod'

export const createAuctionSchema = z
  .object({
    productName: z
      .string()
      .min(1, 'Product name is required')
      .min(3, 'Product name must be at least 3 characters')
      .max(120, 'Product name must be at most 120 characters'),
    category: z.string().min(1, 'Select a category'),
    brand: z
      .string()
      .min(1, 'Brand is required')
      .max(80, 'Brand must be at most 80 characters'),
    condition: z.string().min(1, 'Select a condition'),
    shortDescription: z
      .string()
      .min(1, 'Short description is required')
      .max(160, 'Keep the short description under 160 characters'),
    detailedDescription: z
      .string()
      .min(1, 'Detailed description is required')
      .min(40, 'Add a bit more detail (at least 40 characters)')
      .max(2000, 'Detailed description must be at most 2000 characters'),
    startingPrice: z.coerce
      .number({ error: 'Starting price is required' })
      .positive('Starting price must be greater than 0'),
    reservePrice: z.coerce
      .number({ error: 'Reserve price is required' })
      .positive('Reserve price must be greater than 0'),
    bidIncrement: z.coerce
      .number({ error: 'Bid increment is required' })
      .positive('Bid increment must be greater than 0'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    timezone: z.string().min(1, 'Select a timezone'),
    shippingAvailable: z.boolean(),
    pickupAvailable: z.boolean(),
    shippingCost: z.coerce.number().min(0, 'Shipping cost cannot be negative').optional(),
    location: z
      .string()
      .min(1, 'Location is required')
      .max(120, 'Location must be at most 120 characters'),
    privateNotes: z.string().max(500, 'Private notes must be at most 500 characters').optional(),
    acceptTerms: z.boolean().refine((value) => value === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.reservePrice < data.startingPrice) {
      ctx.addIssue({
        code: 'custom',
        path: ['reservePrice'],
        message: 'Reserve price must be at least the starting price',
      })
    }

    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate)
      const end = new Date(data.endDate)
      if (end <= start) {
        ctx.addIssue({
          code: 'custom',
          path: ['endDate'],
          message: 'End date must be after the start date',
        })
      }
    }

    if (data.shippingAvailable && (data.shippingCost === undefined || Number.isNaN(data.shippingCost))) {
      ctx.addIssue({
        code: 'custom',
        path: ['shippingCost'],
        message: 'Enter a shipping cost when shipping is available',
      })
    }

    if (!data.shippingAvailable && !data.pickupAvailable) {
      ctx.addIssue({
        code: 'custom',
        path: ['pickupAvailable'],
        message: 'Enable shipping or pickup for delivery options',
      })
    }
  })

/** Draft save: required listing fields, but terms acceptance is optional. */
export const createAuctionDraftSchema = z
  .object({
    productName: z
      .string()
      .min(1, 'Product name is required')
      .min(3, 'Product name must be at least 3 characters')
      .max(120, 'Product name must be at most 120 characters'),
    category: z.string().min(1, 'Select a category'),
    brand: z
      .string()
      .min(1, 'Brand is required')
      .max(80, 'Brand must be at most 80 characters'),
    condition: z.string().min(1, 'Select a condition'),
    shortDescription: z
      .string()
      .min(1, 'Short description is required')
      .max(160, 'Keep the short description under 160 characters'),
    detailedDescription: z
      .string()
      .min(1, 'Detailed description is required')
      .min(40, 'Add a bit more detail (at least 40 characters)')
      .max(2000, 'Detailed description must be at most 2000 characters'),
    startingPrice: z.coerce
      .number({ error: 'Starting price is required' })
      .positive('Starting price must be greater than 0'),
    reservePrice: z.coerce
      .number({ error: 'Reserve price is required' })
      .positive('Reserve price must be greater than 0'),
    bidIncrement: z.coerce
      .number({ error: 'Bid increment is required' })
      .positive('Bid increment must be greater than 0'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    timezone: z.string().min(1, 'Select a timezone'),
    shippingAvailable: z.boolean(),
    pickupAvailable: z.boolean(),
    shippingCost: z.coerce.number().min(0, 'Shipping cost cannot be negative').optional(),
    location: z
      .string()
      .min(1, 'Location is required')
      .max(120, 'Location must be at most 120 characters'),
    privateNotes: z.string().max(500, 'Private notes must be at most 500 characters').optional(),
    acceptTerms: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.reservePrice < data.startingPrice) {
      ctx.addIssue({
        code: 'custom',
        path: ['reservePrice'],
        message: 'Reserve price must be at least the starting price',
      })
    }

    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate)
      const end = new Date(data.endDate)
      if (end <= start) {
        ctx.addIssue({
          code: 'custom',
          path: ['endDate'],
          message: 'End date must be after the start date',
        })
      }
    }
  })

export const createAuctionDefaults = () => {
  const start = new Date()
  start.setDate(start.getDate() + 1)
  start.setMinutes(0, 0, 0)

  const end = new Date(start)
  end.setDate(end.getDate() + 7)

  const toLocalInput = (date) => {
    const offset = date.getTimezoneOffset()
    const local = new Date(date.getTime() - offset * 60_000)
    return local.toISOString().slice(0, 16)
  }

  return {
    productName: '',
    category: '',
    brand: '',
    condition: '',
    shortDescription: '',
    detailedDescription: '',
    startingPrice: '',
    reservePrice: '',
    bidIncrement: 50,
    startDate: toLocalInput(start),
    endDate: toLocalInput(end),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    shippingAvailable: true,
    pickupAvailable: false,
    shippingCost: 25,
    location: '',
    privateNotes: '',
    acceptTerms: false,
  }
}
