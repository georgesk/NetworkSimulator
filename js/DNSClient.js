/*
 * This file is part of the Education Network Simulator project and covered
 * by GPLv3 license. See full terms in the LICENSE file at the root folder
 * or at http://www.gnu.org/licenses/gpl-3.0.html.
 *
 * (c) 2015 Jorge García Ochoa de Aspuru
 * bardok@gmail.com
 *
 * Images are copyrighted by their respective authors and have been
 * downloaded from http://pixabay.com/
 *
 */

function createDNSLookup(id)
{
    createBkDiv();
    createDNSLookupDiv(id);
}

function createDNSLookupDiv(id)
{
    var host = network.getElement(id);
    var app = host.getApp("DNSClient");
    /*var div = document.createElement("div");
    var l = window.innerWidth / 2 - 200;
    var t = window.innerHeight / 2 - 75;

    div.setAttribute('style', 'position:absolute;top:' + t + 'px;left:' + l + 'px;z-index:110;background-color:white;width:400px;height:150px;border-radius:10px;border:1px solid;padding:10px;text-align:center;');
    div.setAttribute('id', 'divdnslookup');
    div.innerHTML = app.getAppController();*/
    var controls = '<input type="button" id="upload" value="'+_("Lookup")+'" onclick="requestDNSLookup(' + id + ');" />\
  <input type="button" id="cancel" value="'+_("Cancel")+'" onclick="cancelDNSLookup();" />';
    var w = new UIWindow('divdnslookup', 'DNS lookup', 400, 200, false, 1.0);
    w.setContent(app.getAppController());
    w.setControls(controls);
    w.render();
}

function cancelDNSLookup()
{
    uimanager.getWindow("divdnslookup").dispose();
    removeBodyDiv('divbk');
}

function requestDNSLookup(id)
{
    var elem = network.getElement(id);
    var domain = document.getElementById("dnsclientdomain").value;
    elem.getApp("DNSClient").DNSLookup(domain);
    uimanager.getWindow("divdnslookup").dispose();
    removeBodyDiv('divbk');
}

var DNSClient = function(ifacepos)
{
    var owner = null;
    var ifacepos = ifacepos;
    var localtable = [];

    this.save = function()
    {
        var result = {};
        result.version = 1;
        result.id = this.getId();
        result.ifacepos = ifacepos;

        return result;
    };

    this.load = function(data)
    {
    };

    this.getId = function()
    {
        return "DNSClient";
    };

    this.DNSLookup = function(domain)
    {
      // Tenemos IP?
      if (owner.getConnectable().getIPInfo(ifacepos).getIPv4() !== null)
      {
        //var MAC = owner.getConnectable().getDstMAC(ifacepos, owner.getConnectable().getIPInfo(ifacepos).getDNS1());
        var MAC = owner.getConnectable().getDstMAC(owner.getConnectable().getIPInfo(ifacepos).getDNS1());
        if (MAC !== null)
        {
            var data = {};
            data.domain = domain;
            data.type = "lookup";
            data.description = "Lookup: " + domain;
            var message = new Message(
            "tcp",
            owner.getConnectable().getIPInfo(ifacepos).getIPv4(),
            owner.getConnectable().getIPInfo(ifacepos).getDNS1(),
            owner.getConnectable().getMAC(ifacepos),
            MAC,
            getDinamycPort(),
            53,
            data, images[IMAGE_ENVELOPEDNS]
            );
            owner.getConnectable().getTrafficManager().registerApplication(this, message.getOrigPort(), false);
            owner.getConnectable().getConnector(ifacepos).send(message);
        }
      }
    };

    this.receiveMessage = function(message)
    {
        if (message.getData().ip !== null)
        {
            localtable[message.getData().domain] = message.getData().ip;
        }
    };

    this.setOwner = function(o)
    {
        owner = o;
    };

    this.getIfacepos = function()
    {
        return ifacepos;
    };

    this.getIp = function(domain)
    {
        var result = null;

        if (domain in localtable)
        {
            result = localtable[domain];
        }

        return result;
    };

    this.getLocalTable = function(){
	return localtable;
    };

    this.getAppController = function()
    {
        var id = network.getPosForElement(owner);
        var result = "<p> \
        <label for='dnsclientdomain' >"+_("Domain:")+"</label> \
        <input type='text' id='dnsclientdomain' /> \
        </p>";
        return result;
    };

    this.getMenuEntries = function()
    {
        var data = [];
        data[0] = {};
        data[0].img = 'img/64/envelope-DNS.png';
        data[0].text = 'DNS lookup';
        data[0].js = 'createDNSLookup(' + owner.id + ');';

        return data;
    };
    
    this.getAppDescription = function()
    {
        return "";
    };
    
};
