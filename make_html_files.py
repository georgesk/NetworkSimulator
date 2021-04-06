#! /usr/bin/python3

from jinja2 import Environment
import os

class PageGenerator:
    def __init__(self, template, params, directory = "templates"):
        self.template = template
        self.params = params
        self.directory = directory
        return
    
    def outfname(self):
        return os.path.join(self.directory, self.template)

targets = {
    "simulator.html" : PageGenerator(
        "sim_2048x1024.html",{"title": 'SIMPLE EMPTY SIMULATOR'}
    ),
    "simulatorteacher.html" : PageGenerator(
        "sim_2048x1024.html",{"title": 'TEACHER SIMULATOR'}
    ),
    "simulator01.html" : PageGenerator(
        "sim_2048x1024.html",
        {
            "title": '01 SIMULATOR',
            "initialdata": "NetworkSimulator.initialdata = exampledata;",
            "examples": ["data01"]
        }
    ),
    "simulator01_fr.html" : PageGenerator(
        "sim_2048x1024.html",
        {
            "title": '01 SIMULATEUR',
            "initialdata": "NetworkSimulator.initialdata = exampledata;",
            "examples": ["data01_fr"],
            "localize": "uitranslation.selectLocale('fr_FR');",
        }
    ),
    "reseau_jean_bart.html" : PageGenerator(
        "sim_2048x1024.html",
        {
            "title": 'SIMULATEUR de RÉSEAU JEAN BART',
            "initialdata": "NetworkSimulator.initialdata = exampledata;",
            "examples": ["jeanbart"],
            "localize": "uitranslation.selectLocale('fr_FR');",
        }
    ),
}

jquery_section = {
    "debian": """<script type="text/javascript" src="/javascript/jquery/jquery.min.js"></script>
    <script type="text/javascript" src="/javascript/jquery-ui/jquery-ui.min.js"></script>
    <link rel="stylesheet" type="text/css" href="/javascript/jquery-ui-themes/humanity/jquery-ui.min.css" />
""",
    "default": """<script type="text/javascript" src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script type="text/javascript" src="https://code.jquery.com/ui/1.12.0/jquery-ui.min.js"></script>
    <link rel="stylesheet" type="text/css" href="https://code.jquery.com/ui/1.12.1/themes/humanity/jquery-ui.css" />
"""
}

install = "default"
if "INSTALL_MODE" in os.environ:
    install = os.environ.get("INSTALL_MODE")
for t, gen in targets.items():
    with open(t,"w") as outfile, open(gen.outfname()) as tmpl_file:
        page = Environment().from_string(tmpl_file.read()).render(
            jquery_section = jquery_section[install], **gen.params)
        outfile.write(page)
    
