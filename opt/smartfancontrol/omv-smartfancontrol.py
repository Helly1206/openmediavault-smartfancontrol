#!/usr/bin/env python3
#
# This file is part of OpenMediaVault.
#
# @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
# @author    Volker Theile <volker.theile@openmediavault.org>
# @copyright Copyright (c) 2009-2020 Volker Theile
#
# OpenMediaVault is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# any later version.
#
# OpenMediaVault is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with OpenMediaVault. If not, see <http://www.gnu.org/licenses/>.

#########################################################
# SCRIPT : omv-smartfancontrol.py                       #
#          OMV database control of smartfancontrol      #
#          settings                                     #
#          I. Helwegen 2020                             #
#########################################################
import sys
import os
import json
import xml.etree.ElementTree as ET
from xml.dom.minidom import parseString
import openmediavault.confdbadm
import openmediavault.config.object
import openmediavault.config.database
from getopt import getopt, GetoptError

ID_SFC = "conf.service.smartfancontrol"
XML_FILE_LOC = "/etc/smartfancontrol.xml"
ENCODING = 'utf-8'
DEFAULTDATA = {'fan': {'mode': 'RPM', 'ONOFFgpio': 27, 'ONOFFinvert': False, 'PWMcalibrated': 30, 'PWMgpio': 18, 'RPMpullup': True, 'PWMfrequency': 10000, 'PWMinvert': False, 'recalibrate': 7, 'RPMgpio': 17, 'RPMppr': 2, 'RPMedge': True, 'RPMfiltersize': 0, 'Frequency': 10, 'Pgain': 0.1, 'Igain': 0.2}, 'temp': {'cpu': True, 'hdd': None, 'ext': None, 'mode': 'MAX', 'Farenheit': False, 'AlarmHigh': 65, 'AlarmCrit': 80, 'AlarmShutdown': True}, 'control': {'mode': 'LINEAR', 'TempOn': 55, 'TempHyst': 5, 'TempStart': 45, 'TempFull': 65, 'LinSteps': 2.5, 'Frequency': 1, 'Pgain': 10.0, 'Igain': 0.1}}
TXTELEMENTS = ["hdd","ext","AlarmShutdown"]   

#########################################################
# Class : Readdb                                        #
#########################################################
class Readdb(openmediavault.confdbadm.ICommand):
    @property
    def description(self):
        return "Reads smartfancontrol settings from database."

    def execute(self, dbid):
        db = openmediavault.config.Database()    
        objs = db.get(dbid, None)
        # Prepare the output.
        if isinstance(objs, list):
            data = [obj.get_dict() for obj in objs]
        else:
            if not isinstance(objs, openmediavault.config.Object):
                return None
            data = objs.get_dict()
        return data
#########################################################

#########################################################
# Class : Writedb                                       #
#########################################################
class Writedb(openmediavault.confdbadm.ICommand):
    @property
    def description(self):
        return "Update smartfancontrol configuration object."

    def execute(self, dbid, data):
        # Create the configuration object.
        obj = openmediavault.config.Object(dbid)
        obj.set_dict(data)
        # Put the configuration object.
        db = openmediavault.config.Database()
        if not db.exists(dbid, None):
            print("ERROR: Database ID doesn't exist")
            exit(2)
        db.set(obj)
        return data
       
        
#########################################################

#########################################################
# Class : XML                                           #
#########################################################
class XML(object):
    def __init__(self):
        self.XMLpath = XML_FILE_LOC
        self.settings = {}
        self.GetXML()
    
    def __del__(self):
        del self.settings
        
    def get(self):
        return self.settings
    
    def set(self, settings):
        self.settings = settings
    
    def GetXML(self):
        try:         
            tree = ET.parse(self.XMLpath)
            root = tree.getroot()
            self.settings = {}
        
            for child in root:
                childdict={}
                childname=child.tag
                for toy in child:
                    if toy.tag in TXTELEMENTS:
                        childdict[toy.tag]=self.gettype(toy.text, True)
                    else:
                        childdict[toy.tag]=self.gettype(toy.text)
                self.settings[childname]=childdict
                
        except Exception as e:
            print("Error parsing xml file")
            print("Check XML file syntax for errors")
            print(e)
            exit(1)
            
    def updateXML(self):
        settings = ET.Element('settings')
        comment = ET.Comment(self.getXMLcomment("settings"))
        settings.append(comment)
        for key, value in self.settings.items():
            child = ET.SubElement(settings, key)
            for key, value in value.items():
                toy = ET.SubElement(child, key)
                toy.text = self.settype(value)
    
        with open(self.XMLpath, "w") as xml_file:
            xml_file.write(self.prettify(settings))
    
    def getXMLcomment(self, tag):
        comment = ""
        with open(self.XMLpath, 'r') as xml_file:
            content = xml_file.read()
            xmltag = "<{}>".format(tag)
            xmlend = "</{}>".format(tag)
            begin = content.find(xmltag)
            end = content.find(xmlend)
            content = content[begin:end]
            cmttag = "<!--"
            cmtend = "-->"
            begin = content.find(cmttag)
            end = content.find(cmtend)
            if (begin > -1) and (end > -1):
                comment = content[begin+len(cmttag):end]
        return comment
    
    def prettify(self, elem):
        """Return a pretty-printed XML string for the Element.
        """
        rough_string = ET.tostring(elem, ENCODING)
        reparsed = parseString(rough_string)
        return reparsed.toprettyxml(indent="\t").replace('<?xml version="1.0" ?>','<?xml version="1.0" encoding="%s"?>' % ENCODING)
    
    def gettype(self, text, txtype = False):
        try:
            retval = int(text)
        except:
            try:
                retval = float(text)
            except:
                if text != None:
                    if txtype:
                        if text.lower() == "false" or text.lower() == "true":
                            retval = str(text).upper()
                        else:
                            retval = str(text).lower()
                    elif text.lower() == "false":
                        retval = False
                    elif text.lower() == "true":
                        retval = True
                    else:
                        retval = str(text)
                else:
                    retval = ""
                        
        return retval
    
    def settype(self, element):
        retval = ""
        if type(element) == bool:
            if element:
                retval = "true"
            else:
                retval = "false"
        elif type(element) == str:
            if element == "":
                retval = None
            else:
                retval = element
        elif element != None:
            retval = str(element)
        
        return retval
#########################################################

def writeXML():
    print("Update settings file from DB (omv changes)")
    readdb = Readdb()
    data = readdb.execute(ID_SFC)
    if data == None:
        print("No data")
    else:
        try:
            data.pop('enable')
        except:
            print("Corrupted data")
            exit(1)
        try:
            data.pop('manual')
        except:
            print("Corrupted data")
            exit(1)
        xml = XML()
        xml.set(data)
        xml.updateXML()
    
def Writeconfig():
    print("Update DB from settings file (manual xml changes)")
    readdb = Readdb()
    rddata = readdb.execute(ID_SFC)
    data = {}

    if rddata == None:
        data['enable'] = False # will be updated from OMV
    else:
        try:
            data['enable'] = rddata['enable']
        except:
            data['enable'] = False
    
    data['manual'] = False # after writing to DB always set manual to false
    
    xml = XML()
    xmldata = xml.get()
    if not xmldata:
        xmldata = DEFAULTDATA
    data.update(xmldata)
    writedb = Writedb()
    writedb.execute(ID_SFC, data)    

def parseopts(argv):
    mode = 0
    print("SmartFanControl fan and temperature control (omv functions)")
    try:
        opts, args = getopt(argv,"hd,",["help","db"])
    except GetoptError:
        print("Enter 'omv-smartfancontrol -h' for help")
        exit(2)
    for opt, arg in opts:
        if opt in ("-h", "--help"):
            print("Usage:")
            print("         ovm-smartfancontrol <args>")
            print("         -h, --help   : this help file")
            print("         -d, --db     : Update DB from settings file (manual xml changes)")
            print("         <no argument>: Update settings file from DB (omv changes)")
            exit()
        elif opt in ("-d", "--db"):
            mode = 1
    return mode
    
#########################################################

######################### MAIN ##########################

if __name__ == "__main__":
    mode = parseopts(sys.argv[1:])
    
    if mode == 1:
        Writeconfig()
    else:
        writeXML()
    exit()

    
    