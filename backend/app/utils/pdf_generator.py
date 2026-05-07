import os
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, black, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

# Brand colors
BRAND_PURPLE = HexColor('#58508d')
BRAND_ORANGE = HexColor('#ff8531')
BRAND_RED = HexColor('#ff6361')
DARK_GRAY = HexColor('#333333')
LIGHT_GRAY = HexColor('#666666')

# Register fonts (using standard fonts for now)
# In production, you might want to add custom fonts
try:
    # Try to register Arial if available
    pdfmetrics.registerFont(TTFont('Arial', 'arial.ttf'))
    NORMAL_FONT = 'Arial'
    BOLD_FONT = 'Arial-Bold'
except:
    # Fallback to standard fonts
    NORMAL_FONT = 'Helvetica'
    BOLD_FONT = 'Helvetica-Bold'

def create_checkbox_style():
    """Create style for checkbox items"""
    return ParagraphStyle(
        'CheckboxStyle',
        parent=getSampleStyleSheet()['Normal'],
        fontSize=10,
        leftIndent=20,
        spaceBefore=2,
        spaceAfter=2,
        textColor=DARK_GRAY
    )

def create_heading_style(size=14, color=BRAND_PURPLE):
    """Create heading style"""
    return ParagraphStyle(
        f'Heading{size}',
        parent=getSampleStyleSheet()['Heading1'],
        fontSize=size,
        textColor=color,
        spaceAfter=12,
        spaceBefore=20,
        alignment=TA_LEFT
    )

def create_title_style():
    """Create title style"""
    return ParagraphStyle(
        'TitleStyle',
        parent=getSampleStyleSheet()['Title'],
        fontSize=18,
        textColor=BRAND_PURPLE,
        spaceAfter=16,
        alignment=TA_CENTER,
        leading=22
    )

def create_subtitle_style():
    """Create subtitle style"""
    return ParagraphStyle(
        'SubtitleStyle',
        parent=getSampleStyleSheet()['Normal'],
        fontSize=12,
        textColor=LIGHT_GRAY,
        spaceAfter=24,
        alignment=TA_CENTER,
        leading=16
    )

def generate_ai_integration_checklist():
    """Generate AI Integration Checklist PDF"""
    filename = "ai-integration-checklist.pdf"
    filepath = os.path.join("app/static/resources", filename)
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    doc = SimpleDocTemplate(filepath, pagesize=A4)
    story = []
    styles = getSampleStyleSheet()
    
    # Title
    title_style = create_title_style()
    subtitle_style = create_subtitle_style()
    heading_style = create_heading_style()
    checkbox_style = create_checkbox_style()
    
    story.append(Paragraph("AI Integration Checklist for Businesses", title_style))
    story.append(Paragraph("The Complete 50-Point Checklist to Add AI to Your Product", subtitle_style))
    story.append(Paragraph("By: TFX AI | tfxai.vercel.app", subtitle_style))
    story.append(Spacer(1, 20))
    
    # Section 1: Pre-Integration Assessment
    story.append(Paragraph("1. Pre-Integration Assessment", heading_style))
    checklist_items = [
        "☐ Do you have clear AI use cases identified?",
        "☐ Is your data clean and structured?",
        "☐ Do you have a defined success metric?",
        "☐ Have you evaluated build vs buy vs API?",
        "☐ Is your team AI-literate?",
        "☐ Do you have budget allocated for API costs?",
        "☐ Have you checked compliance requirements?",
        "☐ Is your infrastructure scalable?",
        "☐ Do you have a rollback plan?",
        "☐ Have you identified potential risks?"
    ]
    
    for item in checklist_items:
        story.append(Paragraph(item, checkbox_style))
    
    story.append(Spacer(1, 12))
    
    # Section 2: Choosing the Right AI Model
    story.append(Paragraph("2. Choosing the Right AI Model", heading_style))
    model_items = [
        "☐ GPT-4 for complex reasoning tasks",
        "☐ Gemini for multimodal (text+image)",
        "☐ Claude for long document analysis",
        "☐ Open-source models for cost sensitivity",
        "☐ Fine-tuning vs RAG vs prompting decision",
        "☐ Latency requirements evaluated",
        "☐ Cost per API call calculated",
        "☐ Rate limits understood",
        "☐ SLA/uptime of provider checked",
        "☐ Fallback model identified"
    ]
    
    for item in model_items:
        story.append(Paragraph(item, checkbox_style))
    
    story.append(Spacer(1, 12))
    
    # Section 3: Development Checklist
    story.append(Paragraph("3. Development Checklist", heading_style))
    dev_items = [
        "☐ API keys secured in environment variables",
        "☐ Prompt templates versioned in code",
        "☐ Input validation implemented",
        "☐ Output parsing with error handling",
        "☐ Retry logic for API failures",
        "☐ Response caching where applicable",
        "☐ Rate limiting implemented",
        "☐ Logging for all AI calls",
        "☐ Cost monitoring dashboard set up",
        "☐ User feedback mechanism built",
        "☐ A/B testing framework ready",
        "☐ Prompt injection prevention",
        "☐ PII data handling compliant",
        "☐ Response time < 3 seconds target",
        "☐ Mobile-optimized AI UI"
    ]
    
    for item in dev_items:
        story.append(Paragraph(item, checkbox_style))
    
    story.append(Spacer(1, 12))
    
    # Section 4: Launch & Monitor
    story.append(Paragraph("4. Launch & Monitor", heading_style))
    launch_items = [
        "☐ Performance monitoring in place",
        "☐ Error tracking implemented",
        "☐ User analytics set up",
        "☐ Cost alerts configured",
        "☐ A/B testing results analyzed",
        "☐ User feedback collection system",
        "☐ Documentation completed",
        "☐ Team training conducted",
        "☐ Support escalation process defined",
        "☐ Success metrics dashboard ready"
    ]
    
    for item in launch_items:
        story.append(Paragraph(item, checkbox_style))
    
    story.append(Spacer(1, 20))
    
    # Bonus Tips
    story.append(Paragraph("5 Bonus Tips for Success", heading_style))
    bonus_tips = [
        "✨ Start with a small pilot project before full rollout",
        "✨ Always have a human-in-the-loop for critical decisions",
        "✨ Monitor costs daily in the beginning",
        "✨ Document all prompt engineering decisions",
        "✨ Plan for model updates and version changes"
    ]
    
    for tip in bonus_tips:
        story.append(Paragraph(tip, checkbox_style))
    
    # Footer
    story.append(Spacer(1, 30))
    story.append(Paragraph("Generated by TFX AI | developerarunwork@gmail.com", subtitle_style))
    
    doc.build(story)
    return filepath

def generate_saas_roadmap():
    """Generate SaaS Development Roadmap PDF"""
    filename = "saas-development-roadmap.pdf"
    filepath = os.path.join("app/static/resources", filename)
    
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    doc = SimpleDocTemplate(filepath, pagesize=A4)
    story = []
    
    title_style = create_title_style()
    subtitle_style = create_subtitle_style()
    heading_style = create_heading_style(14, BRAND_ORANGE)
    checkbox_style = create_checkbox_style()
    
    story.append(Paragraph("SaaS Development Roadmap 2025", title_style))
    story.append(Paragraph("From Idea to ₹1 Lakh MRR: The Complete Playbook", subtitle_style))
    story.append(Paragraph("By: TFX AI | tfxai.vercel.app", subtitle_style))
    story.append(Spacer(1, 20))
    
    # Phase 1: Validation
    story.append(Paragraph("Phase 1: Validation (Week 1-2)", heading_style))
    validation_items = [
        "☐ Problem definition framework completed",
        "☐ Market size calculated (TAM, SAM, SOM)",
        "☐ Top 5 competitors analyzed",
        "☐ MVP feature list prioritized",
        "☐ User interview questions prepared (10 questions)",
        "☐ Initial customer interviews conducted",
        "☐ Problem-solution fit validated",
        "☐ Pricing research completed"
    ]
    
    for item in validation_items:
        story.append(Paragraph(item, checkbox_style))
    
    story.append(Spacer(1, 12))
    
    # Phase 2: Technical Architecture
    story.append(Paragraph("Phase 2: Technical Architecture (Week 2-3)", heading_style))
    
    # Tech Stack Table
    tech_stack_data = [
        ['Component', 'Recommended Tech', 'Why'],
        ['Frontend', 'Next.js 15', 'Performance, SEO, Developer Experience'],
        ['Backend', 'FastAPI / Node.js', 'Speed, TypeScript Support'],
        ['Database', 'PostgreSQL (NeonDB)', 'Scalability, Features'],
        ['Auth', 'JWT / NextAuth', 'Security, Social Login'],
        ['Payment', 'Razorpay (India) / Stripe', 'Market Compatibility'],
        ['Deploy', 'Vercel + Render', 'Ease of Use, Scalability']
    ]
    
    tech_table = Table(tech_stack_data, colWidths=[2*inch, 2*inch, 2.5*inch])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BRAND_ORANGE),
        ('TEXTCOLOR', (0,0), (-1,0), white),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 10),
        ('BOTTOMPADDING', (0,0), (-1,0), 12),
        ('BACKGROUND', (0,1), (-1,-1), white),
        ('GRID', (0,0), (-1,-1), 1, black)
    ]))
    
    story.append(tech_table)
    story.append(Spacer(1, 12))
    
    arch_items = [
        "☐ Database schema designed",
        "☐ API endpoints documented",
        "☐ Multi-tenancy approach decided",
        "☐ Security checklist completed",
        "☐ Authentication flow implemented",
        "☐ Data backup strategy defined"
    ]
    
    for item in arch_items:
        story.append(Paragraph(item, checkbox_style))
    
    story.append(PageBreak())
    
    # Phase 3: MVP Development
    story.append(Paragraph("Phase 3: MVP Development (Week 3-8)", heading_style))
    mvp_items = [
        "☐ Sprint planning template created",
        "☐ Core features prioritized (MoSCoW method)",
        "☐ Development environment set up",
        "☐ CI/CD pipeline configured",
        "☐ Unit tests written (80% coverage)",
        "☐ Integration tests implemented",
        "☐ Performance benchmarks defined",
        "☐ User acceptance testing planned",
        "☐ Beta testing program designed",
        "☐ Feedback collection system built"
    ]
    
    for item in mvp_items:
        story.append(Paragraph(item, checkbox_style))
    
    story.append(Spacer(1, 12))
    
    # Phase 4: Launch
    story.append(Paragraph("Phase 4: Launch (Week 8-10)", heading_style))
    launch_items = [
        "☐ Pre-launch checklist completed (20 items)",
        "☐ ProductHunt launch prepared",
        "☐ Marketing materials ready",
        "☐ Customer support system set up",
        "☐ Analytics dashboard configured",
        "☐ Error monitoring implemented",
        "☐ Performance monitoring active",
        "☐ First 100 users strategy defined",
        "☐ Launch day checklist prepared",
        "☐ Post-launch follow-up plan ready"
    ]
    
    for item in launch_items:
        story.append(Paragraph(item, checkbox_style))
    
    story.append(Spacer(1, 12))
    
    # Phase 5: Growth
    story.append(Paragraph("Phase 5: Growth (Month 3+)", heading_style))
    growth_items = [
        "☐ Key metrics tracked (MRR, Churn, LTV)",
        "☐ Pricing strategy for Indian market defined",
        "☐ International expansion plan created",
        "☐ Customer success program implemented",
        "☐ Referral program designed",
        "☐ Content marketing strategy active",
        "☐ SEO optimization ongoing",
        "☐ Paid advertising channels tested",
        "☐ Partnership opportunities explored",
        "☐ Product roadmap for next 6 months planned"
    ]
    
    for item in growth_items:
        story.append(Paragraph(item, checkbox_style))
    
    story.append(Spacer(1, 20))
    
    # Bonus Resources
    story.append(Paragraph("Bonus: Indian SaaS Resources", heading_style))
    bonus_items = [
        "📈 Indian SaaS investor list (50+ contacts)",
        "🛠️ Useful tools & resources (discounted)",
        "🤝 TFX AI contact for implementation support",
        "📚 Free templates and checklists",
        "🎯 Indian market entry strategies"
    ]
    
    for item in bonus_items:
        story.append(Paragraph(item, checkbox_style))
    
    # Footer
    story.append(Spacer(1, 30))
    story.append(Paragraph("Generated by TFX AI | developerarunwork@gmail.com", subtitle_style))
    
    doc.build(story)
    return filepath

def generate_performance_guide():
    """Generate Web Performance Optimization Guide PDF"""
    filename = "web-performance-guide.pdf"
    filepath = os.path.join("app/static/resources", filename)
    
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    doc = SimpleDocTemplate(filepath, pagesize=A4)
    story = []
    
    title_style = create_title_style()
    subtitle_style = create_subtitle_style()
    heading_style = create_heading_style(14, BRAND_RED)
    normal_style = ParagraphStyle(
        'NormalStyle',
        parent=getSampleStyleSheet()['Normal'],
        fontSize=10,
        spaceAfter=6,
        spaceBefore=6,
        textColor=DARK_GRAY
    )
    
    story.append(Paragraph("Web Performance Optimization Guide", title_style))
    story.append(Paragraph("Make Your Website Load in Under 2 Seconds", subtitle_style))
    story.append(Paragraph("By: TFX AI | tfxai.vercel.app", subtitle_style))
    story.append(Spacer(1, 20))
    
    # Chapter 1: Why Performance Matters
    story.append(Paragraph("Chapter 1: Why Performance Matters", heading_style))
    story.append(Paragraph("Statistics show that performance directly impacts business results:", normal_style))
    
    stats_data = [
        ['Metric', 'Impact'],
        ['1s delay', '7% conversion drop'],
        ['2s delay', '12% conversion drop'],
        ['3s delay', '23% conversion drop'],
        ['Poor performance', 'Lower Google rankings'],
        ['Fast site', 'Better user experience']
    ]
    
    stats_table = Table(stats_data, colWidths=[2.5*inch, 3*inch])
    stats_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BRAND_RED),
        ('TEXTCOLOR', (0,0), (-1,0), white),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 10),
        ('BOTTOMPADDING', (0,0), (-1,0), 8),
        ('BACKGROUND', (0,1), (-1,-1), white),
        ('GRID', (0,0), (-1,-1), 1, black)
    ]))
    
    story.append(stats_table)
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("Core Web Vitals Explained:", normal_style))
    vitals = [
        "• LCP (Largest Contentful Paint): Loading performance",
        "• FID (First Input Delay): Interactivity", 
        "• CLS (Cumulative Layout Shift): Visual stability"
    ]
    
    for vital in vitals:
        story.append(Paragraph(vital, normal_style))
    
    story.append(Spacer(1, 12))
    
    # Chapter 2: Image Optimization
    story.append(Paragraph("Chapter 2: Image Optimization", heading_style))
    
    image_formats = [
        ['Format', 'Best For', 'Compression'],
        ['WebP', 'Modern browsers', '25-35% smaller than JPEG'],
        ['PNG', 'Transparency needed', 'Lossless compression'],
        ['JPEG', 'Photographs', 'Good compression ratio'],
        ['AVIF', 'Next-gen', '50% smaller than JPEG']
    ]
    
    image_table = Table(image_formats, colWidths=[1.5*inch, 2*inch, 2.5*inch])
    image_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BRAND_RED),
        ('TEXTCOLOR', (0,0), (-1,0), white),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 9),
        ('BOTTOMPADDING', (0,0), (-1,0), 8),
        ('BACKGROUND', (0,1), (-1,-1), white),
        ('GRID', (0,0), (-1,-1), 1, black)
    ]))
    
    story.append(image_table)
    
    image_tips = [
        "☐ Implement lazy loading for below-fold images",
        "☐ Use responsive images with srcset",
        "☐ Compress images before upload",
        "☐ Serve images from CDN",
        "☐ Use modern formats (WebP, AVIF)",
        "☐ Add proper alt tags for SEO"
    ]
    
    for tip in image_tips:
        story.append(Paragraph(tip, normal_style))
    
    story.append(PageBreak())
    
    # Chapter 3: Code Optimization
    story.append(Paragraph("Chapter 3: Code Optimization", heading_style))
    
    code_tips = [
        "☐ Implement JavaScript bundle splitting",
        "☐ Use tree shaking to remove unused code",
        "☐ Purge unused CSS with tools like PurgeCSS",
        "☐ Extract critical CSS for above-fold content",
        "☐ Minify JavaScript and CSS files",
        "☐ Remove unused dependencies",
        "☐ Use code splitting for routes",
        "☐ Implement dynamic imports for heavy components"
    ]
    
    for tip in code_tips:
        story.append(Paragraph(tip, normal_style))
    
    story.append(Spacer(1, 12))
    
    # Chapter 4: Next.js Specific
    story.append(Paragraph("Chapter 4: Next.js Specific Optimization", heading_style))
    
    nextjs_tips = [
        "☐ Use App Router for better performance",
        "☐ Implement Server Components where possible",
        "☐ Use Next.js Image component for optimization",
        "☐ Implement font optimization with next/font",
        "☐ Use ISR for static content with updates",
        "☐ Optimize bundle size with @next/bundle-analyzer",
        "☐ Implement proper caching strategies",
        "☐ Use getStaticProps for static pages"
    ]
    
    for tip in nextjs_tips:
        story.append(Paragraph(tip, normal_style))
    
    story.append(Spacer(1, 12))
    
    # Chapter 5: Measurement Tools
    story.append(Paragraph("Chapter 5: Measurement Tools", heading_style))
    
    tools_data = [
        ['Tool', 'What It Measures', 'Cost'],
        ['Google PageSpeed Insights', 'Overall performance score', 'Free'],
        ['WebPageTest', 'Detailed performance analysis', 'Free'],
        ['Lighthouse CI', 'Automated performance testing', 'Free'],
        ['Core Web Vitals in GA4', 'Real user metrics', 'Free'],
        ['SpeedCurve', 'Real user monitoring', 'Paid']
    ]
    
    tools_table = Table(tools_data, colWidths=[2*inch, 2.5*inch, 1*inch])
    tools_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BRAND_RED),
        ('TEXTCOLOR', (0,0), (-1,0), white),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 9),
        ('BOTTOMPADDING', (0,0), (-1,0), 8),
        ('BACKGROUND', (0,1), (-1,-1), white),
        ('GRID', (0,0), (-1,-1), 1, black)
    ]))
    
    story.append(tools_table)
    
    story.append(Spacer(1, 12))
    
    # Chapter 6: Quick Wins Checklist
    story.append(Paragraph("Chapter 6: Quick Wins Checklist (20 Items)", heading_style))
    
    quick_wins = [
        "☐ Enable Gzip compression",
        "☐ Add browser caching headers",
        "☐ Optimize images (compress, WebP)",
        "☐ Minify CSS and JavaScript",
        "☐ Remove render-blocking resources",
        "☐ Use CDN for static assets",
        "☐ Implement lazy loading",
        "☐ Reduce server response time",
        "☐ Optimize database queries",
        "☐ Use HTTP/2 if available",
        "☐ Enable HTTP/3 (QUIC)",
        "☐ Preload critical resources",
        "☐ Use resource hints (prefetch, preload)",
        "☐ Optimize fonts loading",
        "☐ Reduce third-party scripts",
        "☐ Implement service worker caching",
        "☐ Use performance monitoring",
        "☐ Set up performance budgets",
        "☐ Regular performance audits",
        "☐ Monitor Core Web Vitals"
    ]
    
    for win in quick_wins:
        story.append(Paragraph(win, normal_style))
    
    # Footer
    story.append(Spacer(1, 30))
    story.append(Paragraph("Generated by TFX AI | developerarunwork@gmail.com", subtitle_style))
    
    doc.build(story)
    return filepath

def generate_all_pdfs():
    """Generate all PDF resources if they don't exist"""
    resources_dir = "app/static/resources"
    os.makedirs(resources_dir, exist_ok=True)
    
    pdfs = [
        ("ai-integration-checklist.pdf", generate_ai_integration_checklist),
        ("saas-development-roadmap.pdf", generate_saas_roadmap),
        ("web-performance-guide.pdf", generate_performance_guide)
    ]
    
    generated_files = []
    for filename, generator in pdfs:
        filepath = os.path.join(resources_dir, filename)
        if not os.path.exists(filepath):
            print(f"Generating {filename}...")
            generator()
            generated_files.append(filepath)
            print(f"✅ Generated {filename}")
        else:
            print(f"ℹ️ {filename} already exists")
    
    return generated_files

if __name__ == "__main__":
    # Test PDF generation
    generate_all_pdfs()
