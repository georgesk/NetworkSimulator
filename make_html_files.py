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
}

for t, gen in targets.items():
    with open(t,"w") as outfile, open(gen.outfname()) as tmpl_file:
        page = Environment().from_string(tmpl_file.read()).render(**gen.params)
        outfile.write(page)
    
