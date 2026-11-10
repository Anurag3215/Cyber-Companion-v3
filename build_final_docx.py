import os
import sys
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

from report_helpers import FONT_HEADER
from part_prelims import build_prelims
from part_ch1_ch2 import build_chapter_1, build_chapter_2
from part_ch3_a import build_chapter_3_a
from part_ch3_b import build_chapter_3_b
from part_ch4_ch5 import build_chapter_4, build_chapter_5
from part_ch6_ch7_ch8 import build_chapter_6, build_chapter_7, build_chapter_8

def generate_report():
    print("Initializing document...")
    doc = Document()

    # SECTION 1: PRELIMS (Pages 1 to 7)
    s1 = doc.sections[0]
    s1.page_width = Inches(8.27)
    s1.page_height = Inches(11.69)
    s1.top_margin = Inches(1.0)
    s1.bottom_margin = Inches(1.0)
    s1.left_margin = Inches(1.25)
    s1.right_margin = Inches(1.0)
    s1.different_first_page_header_footer = True

    # Page number formatting: lowerRoman
    sectPr1 = s1._sectPr
    sectPr1.append(parse_xml(f'<w:pgNumType {nsdecls("w")} w:fmt="lowerRoman"/>'))

    # Footer for prelim pages (centered Roman numeral)
    f_p1 = s1.footer.paragraphs[0]
    f_p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    f_p1.paragraph_format.space_before = Pt(0)
    f_p1.paragraph_format.space_after = Pt(0)
    f_run = f_p1.add_run()
    fldSimple1 = parse_xml(f'<w:fldSimple {nsdecls("w")} w:instr="PAGE"/>')
    f_run._r.append(fldSimple1)
    f_run.font.name = FONT_HEADER
    f_run.font.size = Pt(10)

    print("Building prelims (Cover, Declaration, Certificate, Acknowledgement, Abstract, Contents)...")
    build_prelims(doc)

    # SECTION 2: MAIN REPORT (Pages 8 to 61 -> Report Pages 1 to 54)
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

    # Page number formatting: decimal starting at 1
    sectPr2 = s2._sectPr
    sectPr2.append(parse_xml(f'<w:pgNumType {nsdecls("w")} w:fmt="decimal" w:start="1"/>'))

    # Header for Section 2 (Top line rule)
    hp2 = s2.header.paragraphs[0]
    hp2.alignment = WD_ALIGN_PARAGRAPH.LEFT
    hp2.paragraph_format.space_before = Pt(0)
    hp2.paragraph_format.space_after = Pt(4)
    hrun = hp2.add_run("Cyber Companion: Intelligent Zero-Trust Cybersecurity Awareness System")
    hrun.font.name = FONT_HEADER
    hrun.font.italic = True
    hrun.font.size = Pt(9.5)
    hrun.font.color.rgb = RGBColor(90, 90, 90)

    pBdr_header = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="single" w:sz="6" w:space="4" w:color="000000"/></w:pBdr>')
    hp2._p.get_or_add_pPr().append(pBdr_header)

    # Footer for Section 2 (Bottom line rule, Left Dept, Right Page)
    fp2 = s2.footer.paragraphs[0]
    fp2.paragraph_format.space_before = Pt(4)
    fp2.paragraph_format.space_after = Pt(0)
    fp2.paragraph_format.tab_stops.add_tab_stop(Inches(6.02), WD_TAB_ALIGNMENT.RIGHT)

    frun1 = fp2.add_run("Department of Computer Applications, FISAT\t")
    frun1.font.name = FONT_HEADER
    frun1.font.italic = True
    frun1.font.size = Pt(9.0)
    frun1.font.color.rgb = RGBColor(90, 90, 90)

    frun2 = fp2.add_run()
    fldSimple2 = parse_xml(f'<w:fldSimple {nsdecls("w")} w:instr="PAGE"/>')
    frun2._r.append(fldSimple2)
    frun2.font.name = FONT_HEADER
    frun2.font.size = Pt(9.0)
    frun2.font.color.rgb = RGBColor(90, 90, 90)

    pBdr_footer = parse_xml(f'<w:pBdr {nsdecls("w")}><w:top w:val="single" w:sz="6" w:space="4" w:color="000000"/></w:pBdr>')
    fp2._p.get_or_add_pPr().append(pBdr_footer)

    print("Building Chapter 1 (Introduction)...")
    build_chapter_1(doc)

    print("Building Chapter 2 (Literature Survey)...")
    build_chapter_2(doc)

    print("Building Chapter 3 Part A (Implementation: Architecture, Schemas, Modules 1-3)...")
    build_chapter_3_a(doc)

    print("Building Chapter 3 Part B (Implementation: Modules 4-9, UML, Algorithms)...")
    build_chapter_3_b(doc)

    print("Building Chapter 4 (Result Analysis)...")
    build_chapter_4(doc)

    print("Building Chapter 5 (Conclusion & Future Scope)...")
    build_chapter_5(doc)

    print("Building Chapter 6 (Coding)...")
    build_chapter_6(doc)

    print("Building Chapter 7 (Screen Shots)...")
    build_chapter_7(doc)

    print("Building Chapter 8 (References)...")
    build_chapter_8(doc)

    output_path = "Cyber_Companion_Project_Report.docx"
    print(f"Saving final deliverable to {output_path}...")
    doc.save(output_path)
    print("SUCCESS: Cyber_Companion_Project_Report.docx created successfully!")

if __name__ == "__main__":
    generate_report()
