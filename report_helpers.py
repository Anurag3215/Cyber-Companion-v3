import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

COLOR_TEXT = RGBColor(0, 0, 0)
COLOR_MUTED = RGBColor(100, 100, 100)
FONT_PRIMARY = "Cambria"
FONT_HEADER = "Times New Roman"
FONT_CODE = "Consolas"

def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    cell._tc.get_or_add_tcPr().append(tcMar)

def set_cell_background(cell, hex_color):
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(shd)

def set_table_borders(table, color="D3D3D3", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def add_p(doc, text="", space_before=0, space_after=4, bold=False, italic=False, size=11.5, align=WD_ALIGN_PARAGRAPH.JUSTIFY, line_spacing=1.15):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = line_spacing
    if text:
        r = p.add_run(text)
        r.font.name = FONT_PRIMARY
        r.font.size = Pt(size)
        r.font.bold = bold
        r.font.italic = italic
        r.font.color.rgb = COLOR_TEXT
    return p

def add_bullet(doc, text, bold_prefix="", space_after=3):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.left_indent = Inches(0.25)
    p.paragraph_format.first_line_indent = Inches(-0.25)
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15

    r_bullet = p.add_run("•  ")
    r_bullet.font.name = FONT_PRIMARY
    r_bullet.font.size = Pt(11.5)
    r_bullet.font.bold = True

    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = FONT_PRIMARY
        r_pre.font.size = Pt(11.5)
        r_pre.font.bold = True

    r_text = p.add_run(text)
    r_text.font.name = FONT_PRIMARY
    r_text.font.size = Pt(11.5)
    return p

def add_chapter_title(doc, chapter_num, chapter_title):
    p1 = doc.add_paragraph()
    p1.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p1.paragraph_format.space_before = Pt(18)
    p1.paragraph_format.space_after = Pt(4)
    p1.paragraph_format.keep_with_next = True
    r1 = p1.add_run(f"Chapter {chapter_num}")
    r1.font.name = FONT_PRIMARY
    r1.font.size = Pt(20)
    r1.font.bold = True
    r1.font.color.rgb = COLOR_TEXT

    p2 = doc.add_paragraph()
    p2.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p2.paragraph_format.space_before = Pt(0)
    p2.paragraph_format.space_after = Pt(14)
    p2.paragraph_format.keep_with_next = True
    r2 = p2.add_run(chapter_title)
    r2.font.name = FONT_PRIMARY
    r2.font.size = Pt(20)
    r2.font.bold = True
    r2.font.color.rgb = COLOR_TEXT
    return p2

def add_h1(doc, text, space_before=14, space_after=6):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = FONT_PRIMARY
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = COLOR_TEXT
    return p

def add_h2(doc, text, space_before=12, space_after=4):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = FONT_PRIMARY
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = COLOR_TEXT
    return p

def add_h3(doc, text, space_before=10, space_after=4):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = FONT_PRIMARY
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = COLOR_TEXT
    return p

def add_subheading_bold(doc, text, space_before=8, space_after=3):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = FONT_PRIMARY
    r.font.size = Pt(11.5)
    r.font.bold = True
    r.font.color.rgb = COLOR_TEXT
    return p

def add_figure_image(doc, img_path, caption_text, width=Inches(5.8)):
    p_img = doc.add_paragraph()
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img.paragraph_format.space_before = Pt(8)
    p_img.paragraph_format.space_after = Pt(4)
    p_img.paragraph_format.keep_with_next = True
    if os.path.exists(img_path):
        p_img.add_run().add_picture(img_path, width=width)
    else:
        r = p_img.add_run(f"[{img_path}]")
        r.font.name = FONT_CODE
        r.font.size = Pt(9)

    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_before = Pt(2)
    p_cap.paragraph_format.space_after = Pt(8)
    r_cap = p_cap.add_run(caption_text)
    r_cap.font.name = FONT_PRIMARY
    r_cap.font.size = Pt(10)
    r_cap.font.italic = True
    return p_cap

def add_ui_screenshot_placeholder(doc, title_or_desc, caption_text):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.rows[0].cells[0]
    cell.width = Inches(5.8)
    set_cell_margins(cell, top=260, bottom=260, left=200, right=200)
    set_cell_background(cell, "F7FAFC")
    set_table_borders(tbl, color="CBD5E0", sz="4", val="single")

    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(16)
    p.paragraph_format.space_after = Pt(16)
    r = p.add_run(f"[Insert Cyber Companion UI Screenshot Here: {title_or_desc}]")
    r.font.name = FONT_PRIMARY
    r.font.size = Pt(10.5)
    r.font.bold = True
    r.font.italic = True
    r.font.color.rgb = RGBColor(70, 90, 120)

    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_before = Pt(4)
    p_cap.paragraph_format.space_after = Pt(10)
    r_cap = p_cap.add_run(caption_text)
    r_cap.font.name = FONT_PRIMARY
    r_cap.font.size = Pt(10)
    r_cap.font.italic = True
    return p_cap

def add_code_block(doc, code_str, filename="", desc=""):
    if filename:
        p_fn = doc.add_paragraph()
        p_fn.paragraph_format.space_before = Pt(6)
        p_fn.paragraph_format.space_after = Pt(2)
        p_fn.paragraph_format.keep_with_next = True
        r_fn = p_fn.add_run(filename)
        r_fn.font.name = FONT_PRIMARY
        r_fn.font.size = Pt(11)
        r_fn.font.bold = True

    if desc:
        p_d = doc.add_paragraph()
        p_d.paragraph_format.space_before = Pt(0)
        p_d.paragraph_format.space_after = Pt(4)
        p_d.paragraph_format.keep_with_next = True
        r_d = p_d.add_run(desc)
        r_d.font.name = FONT_PRIMARY
        r_d.font.size = Pt(10.5)
        r_d.font.italic = True

    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.rows[0].cells[0]
    cell.width = Inches(6.0)
    set_cell_margins(cell, top=120, bottom=120, left=160, right=160)
    set_cell_background(cell, "F8F9FA")
    set_table_borders(tbl, color="E2E8F0", sz="4", val="single")

    lines = code_str.strip().split("\n")
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(1)
    p.paragraph_format.line_spacing = 1.05
    for idx, line in enumerate(lines):
        if idx > 0:
            p = cell.add_paragraph()
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(1)
            p.paragraph_format.line_spacing = 1.05
        r = p.add_run(line if line else " ")
        r.font.name = FONT_CODE
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(30, 41, 59)

def add_algorithm_box(doc, algo_title, input_text, steps):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.rows[0].cells[0]
    cell.width = Inches(6.0)
    set_cell_margins(cell, top=140, bottom=140, left=180, right=180)
    set_cell_background(cell, "F8F9FA")
    set_table_borders(tbl, color="E2E8F0", sz="4", val="single")

    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(4)
    r_t = p.add_run(algo_title)
    r_t.font.name = FONT_PRIMARY
    r_t.font.size = Pt(10.5)
    r_t.font.bold = True

    if input_text:
        p_in = cell.add_paragraph()
        p_in.paragraph_format.space_before = Pt(0)
        p_in.paragraph_format.space_after = Pt(4)
        r_in = p_in.add_run(input_text)
        r_in.font.name = FONT_PRIMARY
        r_in.font.size = Pt(9.5)
        r_in.font.italic = True

    for step in steps:
        p_s = cell.add_paragraph()
        p_s.paragraph_format.space_before = Pt(0)
        p_s.paragraph_format.space_after = Pt(2)
        p_s.paragraph_format.line_spacing = 1.1
        r_s = p_s.add_run(step)
        r_s.font.name = FONT_CODE
        r_s.font.size = Pt(8.5)
        r_s.font.color.rgb = RGBColor(30, 41, 59)

def add_table_header(doc, caption_text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(caption_text)
    r.font.name = FONT_PRIMARY
    r.font.size = Pt(10.5)
    r.font.bold = True
    return p
