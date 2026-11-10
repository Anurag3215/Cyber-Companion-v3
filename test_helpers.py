import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def create_test_doc():
    doc = Document()

    # Section 1: Prelims
    s1 = doc.sections[0]
    s1.page_width = Inches(8.27)
    s1.page_height = Inches(11.69)
    s1.top_margin = Inches(1.0)
    s1.bottom_margin = Inches(1.0)
    s1.left_margin = Inches(1.25)
    s1.right_margin = Inches(1.0)
    s1.different_first_page_header_footer = True

    # Roman numeral footer for s1
    sectPr1 = s1._sectPr
    sectPr1.append(parse_xml(f'<w:pgNumType {nsdecls("w")} w:fmt="lowerRoman"/>'))

    # Normal footer for s1
    f_p1 = s1.footer.paragraphs[0]
    f_p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    f_run = f_p1.add_run()
    fldSimple = parse_xml(f'<w:fldSimple {nsdecls("w")} w:instr="PAGE"/>')
    f_run._r.append(fldSimple)
    f_run.font.name = "Times New Roman"
    f_run.font.size = Pt(10)

    # Add Cover
    doc.add_paragraph("Cover Page")
    doc.add_page_break()
    doc.add_paragraph("Prelim Page 2")

    # Section 2: Main Chapters
    s2 = doc.add_section()
    s2.different_first_page_header_footer = False
    s2.header.is_linked_to_previous = False
    s2.footer.is_linked_to_previous = False
    s2.page_width = Inches(8.27)
    s2.page_height = Inches(11.69)
    s2.top_margin = Inches(1.0)
    s2.bottom_margin = Inches(1.0)
    s2.left_margin = Inches(1.25)
    s2.right_margin = Inches(1.0)

    sectPr2 = s2._sectPr
    sectPr2.append(parse_xml(f'<w:pgNumType {nsdecls("w")} w:fmt="decimal" w:start="1"/>'))

    # Header s2
    hp2 = s2.header.paragraphs[0]
    hp2.alignment = WD_ALIGN_PARAGRAPH.LEFT
    hrun = hp2.add_run("Cyber Companion: Intelligent Zero-Trust Cybersecurity Awareness & Protection System")
    hrun.font.name = "Times New Roman"
    hrun.font.italic = True
    hrun.font.size = Pt(9.5)
    hrun.font.color.rgb = RGBColor(80, 80, 80)
    pBdr = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="single" w:sz="6" w:space="4" w:color="000000"/></w:pBdr>')
    hp2._p.get_or_add_pPr().append(pBdr)

    # Footer s2
    fp2 = s2.footer.paragraphs[0]
    fp2.paragraph_format.tab_stops.add_tab_stop(Inches(6.02), WD_TAB_ALIGNMENT.RIGHT)
    frun1 = fp2.add_run("Department of Computer Applications, FISAT\t")
    frun1.font.name = "Times New Roman"
    frun1.font.italic = True
    frun1.font.size = Pt(9)
    frun1.font.color.rgb = RGBColor(80, 80, 80)

    frun2 = fp2.add_run()
    fldSimple2 = parse_xml(f'<w:fldSimple {nsdecls("w")} w:instr="PAGE"/>')
    frun2._r.append(fldSimple2)
    frun2.font.name = "Times New Roman"
    frun2.font.size = Pt(9)
    frun2.font.color.rgb = RGBColor(80, 80, 80)

    pBdr2 = parse_xml(f'<w:pBdr {nsdecls("w")}><w:top w:val="single" w:sz="6" w:space="4" w:color="000000"/></w:pBdr>')
    fp2._p.get_or_add_pPr().append(pBdr2)

    doc.add_paragraph("Report Page 1")
    doc.save("test_helpers_out.docx")
    print("test_helpers_out.docx generated successfully!")

create_test_doc()
