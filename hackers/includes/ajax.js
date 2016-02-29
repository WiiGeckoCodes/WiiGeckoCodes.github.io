 //this document copyright 2009-2010 James Atherton

function ToggleCh()
{
	if(document.getElementById("chnav").style.display!="none")
		document.getElementById("chnav").style.display = "none";
	else
		document.getElementById("chnav").style.display = "inline";
}

var xmlHttp

function changeNav(sysid, reg)
{
	xmlHttp=GetXmlHttpObject()
	if (xmlHttp==null)
	{
		alert ("AJAX not supported, disable JavaScript.")
		return
	}
	var url="nav.php?chid="+sysid.substring(0,1);
	url = url+"&r="+reg.substring(0,1);
	xmlHttp.onreadystatechange=stateChanged
	xmlHttp.open("GET",url,true)
	xmlHttp.send(null)
}

function stateChanged()
{
	if (xmlHttp.readyState==4 || xmlHttp.readyState=="complete")
	{
		document.getElementById("navigation").innerHTML=xmlHttp.responseText
		ToggleCh()
	}
}

function GetXmlHttpObject()
{
	var objXMLHttp=null
	if (window.XMLHttpRequest)
	{
		objXMLHttp=new XMLHttpRequest()
	}
	else if (window.ActiveXObject)
	{
		objXMLHttp=new ActiveXObject("Microsoft.XMLHTTP")
	}
	return objXMLHttp
}