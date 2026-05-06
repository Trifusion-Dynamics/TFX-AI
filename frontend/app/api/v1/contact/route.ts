import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received request body:', body)
    
    // Validate required fields
    const { name, email, phone, subject, message } = body
    
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Log the lead data (in production, this would send to your backend/email service)
    console.log('🎯 New Calculator Lead:', {
      name,
      email,
      phone: phone || 'Not provided',
      subject,
      message,
      timestamp: new Date().toISOString(),
      source: 'calculator'
    })

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification to admin
    // 3. Send confirmation email to client
    // 4. Integrate with CRM (HubSpot, Salesforce, etc.)

    // For now, we'll simulate successful submission
    // In production, replace this with actual email sending logic
    
    // Example email sending (uncomment and implement with your email service):
    /*
    await sendEmail({
      to: 'admin@tfxai.com',
      subject: `New Calculator Lead: ${subject}`,
      html: `
        <h2>New Project Calculator Lead</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <pre>${message}</pre>
        <p><strong>Source:</strong> Project Calculator</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      `
    })

    await sendEmail({
      to: email,
      subject: 'Your Project Estimate from TFX AI',
      html: `
        <h2>Thank you for your interest!</h2>
        <p>Hi ${name},</p>
        <p>We've received your project estimate request and will get back to you shortly with a detailed quote.</p>
        <p>Your project details:</p>
        <pre>${message}</pre>
        <p>Best regards,<br/>TFX AI Team</p>
      `
    })
    */

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json(
      { 
        success: true,
        message: 'Lead captured successfully! We\'ll contact you soon.',
        data: {
          name,
          email,
          subject,
          timestamp: new Date().toISOString()
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('❌ Error processing calculator lead:', error)
    
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Calculator API endpoint is working' },
    { status: 200 }
  )
}
