from reportlab.lib import colors
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
)


OUTPUT = "output/pdf/study-mesh-pitch.pdf"
PAGE_SIZE = landscape(A4)
WIDTH, HEIGHT = PAGE_SIZE

INK = colors.HexColor("#17202a")
MUTED = colors.HexColor("#617084")
BLUE = colors.HexColor("#2563eb")
BLUE_DARK = colors.HexColor("#1e40af")
GREEN = colors.HexColor("#0f9f6e")
ORANGE = colors.HexColor("#f97316")
PURPLE = colors.HexColor("#7c3aed")
PAPER = colors.HexColor("#f6f8fb")
LINE = colors.HexColor("#d9e2ec")
WHITE = colors.white


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="DeckTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=38,
        leading=42,
        textColor=WHITE,
        spaceAfter=18,
    )
)
styles.add(
    ParagraphStyle(
        name="SlideTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=28,
        leading=32,
        textColor=INK,
        spaceAfter=14,
    )
)
styles.add(
    ParagraphStyle(
        name="SubTitle",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=15,
        leading=22,
        textColor=colors.HexColor("#e6f0ff"),
    )
)
styles.add(
    ParagraphStyle(
        name="Body",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=12,
        leading=17,
        textColor=MUTED,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="BodyDark",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=12,
        leading=17,
        textColor=INK,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="CardTitle",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=18,
        textColor=INK,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="Eyebrow",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=12,
        textColor=GREEN,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="Stat",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=26,
        textColor=BLUE_DARK,
        alignment=1,
    )
)


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)
    canvas.setFillColor(BLUE)
    canvas.roundRect(36, HEIGHT - 52, 28, 28, 6, fill=1, stroke=0)
    canvas.setFillColor(WHITE)
    canvas.setFont("Helvetica-Bold", 8)
    canvas.drawCentredString(50, HEIGHT - 34, "SM")
    canvas.setFillColor(INK)
    canvas.setFont("Helvetica-Bold", 12)
    canvas.drawString(72, HEIGHT - 35, "Study Mesh")
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 9)
    canvas.drawRightString(WIDTH - 36, 26, f"Page {doc.page}")
    canvas.restoreState()


def title_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(INK)
    canvas.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)
    canvas.setFillColor(BLUE)
    canvas.circle(WIDTH - 130, HEIGHT - 110, 74, fill=1, stroke=0)
    canvas.setFillColor(GREEN)
    canvas.circle(WIDTH - 260, 120, 55, fill=1, stroke=0)
    canvas.setFillColor(ORANGE)
    canvas.circle(WIDTH - 90, 150, 38, fill=1, stroke=0)
    canvas.setStrokeColor(colors.Color(1, 1, 1, alpha=0.28))
    canvas.setLineWidth(4)
    canvas.line(WIDTH - 260, 120, WIDTH - 130, HEIGHT - 110)
    canvas.line(WIDTH - 130, HEIGHT - 110, WIDTH - 90, 150)
    canvas.setFillColor(BLUE)
    canvas.roundRect(54, HEIGHT - 100, 42, 42, 8, fill=1, stroke=0)
    canvas.setFillColor(WHITE)
    canvas.setFont("Helvetica-Bold", 11)
    canvas.drawCentredString(75, HEIGHT - 75, "SM")
    canvas.setFont("Helvetica-Bold", 13)
    canvas.drawString(108, HEIGHT - 74, "Study Mesh")
    canvas.restoreState()


def card(content, width=2.25 * inch):
    return Table(
        [[content]],
        colWidths=[width],
        style=TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), WHITE),
                ("BOX", (0, 0), (-1, -1), 0.8, LINE),
                ("ROUNDEDCORNERS", (0, 0), (-1, -1), 8),
                ("LEFTPADDING", (0, 0), (-1, -1), 14),
                ("RIGHTPADDING", (0, 0), (-1, -1), 14),
                ("TOPPADDING", (0, 0), (-1, -1), 14),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
            ]
        ),
    )


def bullet_items(items):
    return [Paragraph(f"- {item}", styles["BodyDark"]) for item in items]


def build():
    doc = SimpleDocTemplate(
        OUTPUT,
        pagesize=PAGE_SIZE,
        rightMargin=54,
        leftMargin=54,
        topMargin=76,
        bottomMargin=48,
    )

    story = []

    story.append(Spacer(1, 1.1 * inch))
    story.append(Paragraph("Study Mesh", styles["DeckTitle"]))
    story.append(
        Paragraph(
            "A Singapore-focused peer-to-peer tutoring prototype connecting students across Primary, Secondary, Polytechnic, Junior College, and University levels.",
            styles["SubTitle"],
        )
    )
    story.append(Spacer(1, 0.35 * inch))
    story.append(
        Table(
            [
                [
                    Paragraph("Find tutors", styles["BodyDark"]),
                    Paragraph("Book sessions", styles["BodyDark"]),
                    Paragraph("Track schedule", styles["BodyDark"]),
                    Paragraph("$3 study notes", styles["BodyDark"]),
                ]
            ],
            colWidths=[1.45 * inch] * 4,
            style=TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#eaf1ff")),
                    ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#9db7ff")),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("TOPPADDING", (0, 0), (-1, -1), 10),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                ]
            ),
        )
    )
    story.append(PageBreak())

    story.append(Paragraph("PROBLEM", styles["Eyebrow"]))
    story.append(Paragraph("Students need affordable help that matches their exact education stage.", styles["SlideTitle"]))
    problem_cards = [
        card(
            [
                Paragraph("Mismatch", styles["CardTitle"]),
                Paragraph("Generic tutoring platforms do not always map neatly to PSLE, O-Level, A-Level, polytechnic modules, or university foundations.", styles["Body"]),
            ]
        ),
        card(
            [
                Paragraph("Cost pressure", styles["CardTitle"]),
                Paragraph("Private tutoring can be expensive, while peer tutoring can be more affordable and relatable.", styles["Body"]),
            ]
        ),
        card(
            [
                Paragraph("Organisation", styles["CardTitle"]),
                Paragraph("Students need one place to compare tutors, book sessions, track schedules, and access notes.", styles["Body"]),
            ]
        ),
    ]
    story.append(Table([problem_cards], colWidths=[2.45 * inch] * 3, hAlign="LEFT"))
    story.append(PageBreak())

    story.append(Paragraph("SOLUTION", styles["Eyebrow"]))
    story.append(Paragraph("Study Mesh makes peer tutoring feel simple, local, and organised.", styles["SlideTitle"]))
    solution = [
        "Tutor discovery by subject and Singapore education level",
        "Visible per-session pricing before booking",
        "Booking form with date, time, subject, tutor, and place",
        "Session tracker showing who, when, where, and what subject",
        "$3 notes marketplace for quick revision packs",
        "Signup profile that stores learning goals and tutoring offers",
    ]
    story.extend(bullet_items(solution))
    story.append(Spacer(1, 0.15 * inch))
    story.append(
        Table(
            [[Paragraph("Prototype focus: demonstrate the core student journey without requiring a backend.", styles["BodyDark"])]],
            colWidths=[7.2 * inch],
            style=TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#d9fbe8")),
                    ("BOX", (0, 0), (-1, -1), 0.8, GREEN),
                    ("LEFTPADDING", (0, 0), (-1, -1), 14),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 14),
                    ("TOPPADDING", (0, 0), (-1, -1), 12),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
                ]
            ),
        )
    )
    story.append(PageBreak())

    story.append(Paragraph("USER JOURNEY", styles["Eyebrow"]))
    story.append(Paragraph("From finding help to tracking the session.", styles["SlideTitle"]))
    journey = [
        ["1", "Find Tutor", "Filter by Math, Science, English, Chinese, or Coding and select a Singapore education level."],
        ["2", "Compare", "Review tutor rating, focus area, level, and session price."],
        ["3", "Book", "Choose tutor, subject, date, place, and available time."],
        ["4", "Track", "View upcoming sessions with tutor, schedule, place, and subject."],
    ]
    table = Table(
        [[Paragraph(a, styles["Stat"]), Paragraph(b, styles["CardTitle"]), Paragraph(c, styles["Body"])] for a, b, c in journey],
        colWidths=[0.55 * inch, 1.55 * inch, 5.1 * inch],
        style=TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), WHITE),
                ("BOX", (0, 0), (-1, -1), 0.8, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        ),
    )
    story.append(table)
    story.append(PageBreak())

    story.append(Paragraph("MARKET FIT", styles["Eyebrow"]))
    story.append(Paragraph("Built around Singapore education pathways.", styles["SlideTitle"]))
    levels = [
        ["Primary", "PSLE Math, Science, English, Chinese"],
        ["Secondary", "O-Level E-Math, Science, English, oral practice"],
        ["Junior College", "H2 Math, General Paper, A-Level preparation"],
        ["Polytechnic", "Programming, engineering math, statistics, projects"],
        ["University", "Coding, academic writing, foundation modules"],
    ]
    level_table = Table(
        [[Paragraph(level, styles["CardTitle"]), Paragraph(desc, styles["Body"])] for level, desc in levels],
        colWidths=[1.9 * inch, 5.3 * inch],
        style=TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), WHITE),
                ("BOX", (0, 0), (-1, -1), 0.8, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        ),
    )
    story.append(level_table)
    story.append(PageBreak())

    story.append(Paragraph("BUSINESS MODEL", styles["Eyebrow"]))
    story.append(Paragraph("Affordable learning with simple revenue paths.", styles["SlideTitle"]))
    model_cards = [
        card([Paragraph("Tutoring fees", styles["CardTitle"]), Paragraph("Peer tutors list session prices such as $5 to $10 per session in the prototype.", styles["Body"])]),
        card([Paragraph("Study notes", styles["CardTitle"]), Paragraph("Students can buy peer-made notes by level or subject for $3 per pack.", styles["Body"])]),
        card([Paragraph("Future platform fee", styles["CardTitle"]), Paragraph("A production version could take a small service fee from bookings or note sales.", styles["Body"])]),
    ]
    story.append(Table([model_cards], colWidths=[2.45 * inch] * 3, hAlign="LEFT"))
    story.append(PageBreak())

    story.append(Paragraph("NEXT STEPS", styles["Eyebrow"]))
    story.append(Paragraph("Move from prototype to real platform.", styles["SlideTitle"]))
    next_steps = [
        "Add real accounts with Supabase or Firebase Auth",
        "Store users, tutors, bookings, and notes in a shared database",
        "Add tutor availability management",
        "Add payment handling for notes and sessions",
        "Add reviews, reporting, and moderation",
        "Pilot with a small student group and improve based on feedback",
    ]
    story.extend(bullet_items(next_steps))

    doc.build(story, onFirstPage=title_page, onLaterPages=header_footer)


if __name__ == "__main__":
    build()
