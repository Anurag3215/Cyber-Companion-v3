import docx

doc = docx.Document('Cyber_Companion_Project_Report.docx')
breaks = 0
for p in doc.paragraphs:
    if 'w:type="page"' in p._p.xml:
        breaks += 1

print('Explicit page breaks added:', breaks)
print('Document sections:', len(doc.sections))
print('Sections + Page breaks:', breaks + len(doc.sections) - 1)
