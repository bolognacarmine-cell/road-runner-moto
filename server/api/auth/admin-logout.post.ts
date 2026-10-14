import { defineEventHandler } from 'h3'
import { clearAdminCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  clearAdminCookie(event)
  return { success: true }
})