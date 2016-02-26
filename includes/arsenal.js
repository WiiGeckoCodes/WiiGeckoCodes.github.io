//this document copyright 2010 - 2012 James Atherton

var lnbreaks=document.all?"\r\n":"\n";

function HexFloat() {
	document.hexfloat.hf.value+=document.hexfloat.hex.value + " = " + document.hexfloat.float.value + "\n"
}

function HexDec() {
	document.hexdec.hd.value+=document.hexdec.hex.value + " = " + document.hexdec.dec.value + "\n"
}

function SaveASCII() {
	document.asciihex.ah.value+=document.asciihex.ascii.value + "\n-----------------\n" + document.asciihex.hex.value + "\n\n"
}

function ToASCII() {
	var HexString = document.asciihex.hex.value.replace(/\s|\r/g,"");
	if(document.getElementById("UTF8").checked)
		document.asciihex.ascii.value=hexToUtf8(HexString);
	else {
		document.asciihex.ascii.value="";
		while(HexString!="") {
			document.asciihex.ascii.value+=String.fromCharCode(parseInt(HexString.substr(0,2),16)&255);
			HexString=HexString.substr(2);
		}
	}
}

function FromASCII() {
	var ASCIIString = document.asciihex.ascii.value.replace(/\r/g,"");
	if(document.getElementById("UTF8").checked) {
		var input=utf8ToHex(ASCIIString);
		var codeformatted="";
		for(var i=0; i<input.length; i+=2) {
			if(i%8==0&&i>0) i%16==0?codeformatted+=lnbreaks:codeformatted+=" ";
			codeformatted+=input.substr(i,2);
		}
		document.asciihex.hex.value=codeformatted;
	} else {
		document.asciihex.hex.value="";
		for(var x=0; ASCIIString!=""; x++) {
			if(x%4==0&&x>0) x%8==0?document.asciihex.hex.value+=lnbreaks:document.asciihex.hex.value+=" ";
			if(Number(ASCIIString.charCodeAt(0))<16) document.asciihex.hex.value+="0";
			document.asciihex.hex.value+=Number(ASCIIString.charCodeAt(0)).toString(16).toUpperCase();
			ASCIIString=ASCIIString.substr(1);
		}
	}
}

function utf8ToHex(input) {
	var str=unescape(encodeURIComponent(input));
	var output="";
	for(var i=0; i<str.length; i++) {
		var hx=str.charCodeAt(i).toString(16);
		while(hx.length<2) hx="0"+hx;
		output+=hx;
	}
	return output.toUpperCase();
}

function hexToUtf8(input) {
	var output="";
	for(var i=0; i<input.length; i+=2)
		output+=String.fromCharCode("0x"+input.substr(i,2));
	return decodeURIComponent(escape(output));
}

function GetXmlHttpObject()
{
	var objXMLHttp=null
	if(window.XMLHttpRequest)
	{
		objXMLHttp=new XMLHttpRequest()
	}
	else if(window.ActiveXObject)
	{
		objXMLHttp=new ActiveXObject("Microsoft.XMLHTTP")
	}
	return objXMLHttp
}

function ToHex()
{
	xmlHttp=GetXmlHttpObject()
	if(xmlHttp==null)
	{
		alert ("Browser does not support HTTP Request")
		return
	}
	var url="arsenal.php"
	url=url+"?tohex="+document.hexfloat.float.value
	//url=url+"&sid="+Math.random()
	xmlHttp.onreadystatechange=hexChange
	xmlHttp.open("GET",url,true)
	xmlHttp.send(null)
}

function hexChange()
{
	if(xmlHttp.readyState==4 || xmlHttp.readyState=="complete")
	{
		document.hexfloat.hex.value=xmlHttp.responseText
	}
}

function ToFloat()
{
	xmlHttp=GetXmlHttpObject()
	if(xmlHttp==null)
	{
		alert ("Browser does not support HTTP Request")
		return
	}
	var url="arsenal.php"
	url=url+"?tofloat="+document.hexfloat.hex.value
	//url=url+"&sid="+Math.random()
	xmlHttp.onreadystatechange=floatChange
	xmlHttp.open("GET",url,true)
	xmlHttp.send(null)
}

function floatChange()
{
	if(xmlHttp.readyState==4 || xmlHttp.readyState=="complete")
	{
		document.hexfloat.float.value=xmlHttp.responseText
	}
}


function DecimalToHex()
{
	if(Number(document.hexdec.dec.value)<Number(-2147483648))
	{
		document.hexdec.hex.value="Too Small; Signed 32 bit overflow."
	}
	else if(Number(document.hexdec.dec.value)<0)
	{
		document.hexdec.Signed.checked=true;
		document.hexdec.hex.value=(Number(document.hexdec.dec.value)+0xFFFFFFFF+1).toString(16).toUpperCase().substr(0,8);
	}
	else if(Number(document.hexdec.dec.value)>4294967295)
	{
		document.hexdec.hex.value="Too big; Unsigned 32 bit overflow."
	}
	else
	{
		if( Number(document.hexdec.dec.value) > 2147483647 ) {
			document.hexdec.Signed.checked=false;
		}
		document.hexdec.hex.value=Number(document.hexdec.dec.value).toString(16).toUpperCase().substr(0,8);
		while(document.hexdec.hex.value.length<8)document.hexdec.hex.value="0"+document.hexdec.hex.value;
	}
}

function HexToDecimal()
{
	if(document.hexdec.Signed.checked && parseInt(document.hexdec.hex.value,16)>2147483647)
		document.hexdec.dec.value=-((~parseInt(document.hexdec.hex.value,16))+1);
	else
		document.hexdec.dec.value=parseInt(document.hexdec.hex.value,16);
}

















//Button Conditionals

var AddressOkay=true;
var SetButtonsOkay=true;

function Buttons(Bob)
{
	if(!AddressOkay)
		return;
	Bob.style.backgroundColor="#"+(Bob.title!="Included - "+Bob.alt?document.stuff.ColorClick.value:document.stuff.ColorNormal.value);
	Bob.title!="Included - "+Bob.alt?Bob.title="Included - "+Bob.alt:Bob.title=Bob.alt;
	Bob.form.OR.value=Number(parseInt(Bob.value,16)^parseInt(Bob.form.OR.value,16)).toString(16).toUpperCase();
	while(Bob.form.OR.value.length<4)Bob.form.OR.value="0"+Bob.form.OR.value;
	Bob.form.NOT.value=Number((~parseInt(Bob.form.OR.value,16))+0xFFFF+1).toString(16).toUpperCase();
	Bob.form.last.value=(Bob.alt+Bob.form.last.value).substr(0,87);
	Bob.blur();
	Update();
}

function OverButton(Bob,Enter)
{
	if(document.stuff.CanReset.value.indexOf(Bob.form.name)==-1)
		document.stuff.CanReset.value+=" "+Bob.form.name;
	if(!AddressOkay)
		return;
	if(Bob.title!="Included - "+Bob.alt)
		Bob.style.backgroundColor="#"+(Enter?document.stuff.ColorHover.value:document.stuff.ColorNormal.value);
	if(document.results.Current.value!=Bob.form.name)
	{
		document.results.Current.value=Bob.form.name;
		Bob.form.last.value.length>0?CheckConflict(Bob.form.last):Bob.form.last.value="";
		document.getElementById("targetdisplay").innerHTML="Result ("+Bob.form.name+")";
		Update();
	}
}

function Validate()
{
	AddressOkay=(/^[A-Fa-f0-9]{8}$/.test(document.results.Address.value));
	document.results.Address.style.backgroundColor=AddressOkay?"transparent":"#FFCCCC";
	ValidateSetButtons();
	if(!AddressOkay)
		return;
	document.results.Address.value=Number(0xFFFFFFFF+(0xF1FFFFFF & ((parseInt(document.results.Address.value,16)>>>1)<<1))+1).toString(16).toUpperCase();
	Update();
}

function Update()
{
	if(!AddressOkay)
		return;
	var ResultString = document.results.Pointer.checked?"3":"2";
	var FullAddress=(((parseInt(document.results.Address.value,16)<<7)>>>8)<<1)+(document.results.Endif.checked?1:0);
	ResultString+=Number((parseInt(document.results.CT.value,16)<<24)+FullAddress).toString(16).toUpperCase()+" ";
	var WhereFrom = document.getElementsByName(document.results.Current.value);
	
	while(WhereFrom[0].NOT.value.length<4)WhereFrom[0].NOT.value="0"+WhereFrom[0].NOT.value;
	
	if(document.results.Inclusive.checked)
		ResultString+=WhereFrom[0].NOT.value;
	else
		ResultString+="0000";
	
	ResultString+=WhereFrom[0].OR.value;
	
	var Bytes=new Array(ResultString.substr(9,2), ResultString.substr(11,2), ResultString.substr(13,2), ResultString.substr(15,2));
	
	if(document.results.Reverse.checked)
		ResultString=ResultString.substr(0,9)+Bytes[1]+Bytes[0]+Bytes[3]+Bytes[2];
	if(WhereFrom[0].ORle)
		WhereFrom[0].ORle.value=Bytes[3]+Bytes[2];
	if(WhereFrom[0].NOTle)
		WhereFrom[0].NOTle.value=WhereFrom[0].NOT.value.substr(2,2)+WhereFrom[0].NOT.value.substr(0,2);
	
	document.results.Output.value=ResultString;
}

function CheckConflict(OnThis)
{
	xmlHttp=GetXmlHttpObject()
	if(xmlHttp==null) OnThis.value="";
	else {
		var url="arsenal.php";
		url=url+"?conflict="+OnThis.value;
		//url=url+"&nocache="+Math.random();
		xmlHttp.onreadystatechange=AlertConflict;
		xmlHttp.open("GET",url,true);
		xmlHttp.send(null);
	}
}

function AlertConflict()
{
	if((xmlHttp.readyState==4 || xmlHttp.readyState=="complete")&&xmlHttp.responseText!=""){
		document.getElementById("space").innerHTML=xmlHttp.responseText+document.getElementById("space").innerHTML; ResetAll();}
}

function ResetData()
{
	var WhereFrom = document.getElementsByName(document.results.Current.value);
	if(WhereFrom.length!=0)
	{
		WhereFrom[0].last.value="";
		WhereFrom[0].OR.value="0000";
		WhereFrom[0].NOT.value="FFFF";
		var FormButton = document.getElementsByName("bttn"+document.results.Current.value);
		for(var x=0; x<FormButton.length; x++)
		{
			if(FormButton[x].form.name==document.results.Current.value)
			{
				FormButton[x].title=FormButton[x].alt;
				FormButton[x].style.backgroundColor="#"+document.stuff.ColorNormal.value;
			}
			//document.results.Output.value+=FormButton[x].form.name+" ["+x+"] ";
		}
		Update();
	}
}

function ResetAll()
{
	var ResetThese=document.stuff.CanReset.value.split(' ');
	for(var x=ResetThese.length; x>=0; x--)
	{
		document.results.Current.value=ResetThese[x];
		ResetData();
	}
	document.getElementById("targetdisplay").innerHTML="Result (wii)";
	Update();
}

function ValidateSetButtons()
{
	SetButtonsOkay=(/^[A-Fa-f0-9]{4}$/.test(document.results.ToButtons.value))&&AddressOkay;
	if(!SetButtonsOkay)
	{
		document.results.ToButtons.style.backgroundColor="#FFCCCC";
		return;
	}

	document.results.ToButtons.style.backgroundColor="transparent";
	document.results.ToButtons.value=document.results.ToButtons.value.toUpperCase();
}

function SetButtons()
{
	if(!SetButtonsOkay || !AddressOkay)
		return;
	
	var Value=document.results.ToButtons.value;
	
	if(document.results.Reverse.checked)
		Value=Value.substr(2,2)+Value.substr(0,2);
	
	var NewValue=parseInt(Value,16);
	
	var WhereFrom = document.getElementsByName(document.results.Current.value);
	WhereFrom[0].OR.value="0000";
	WhereFrom[0].NOT.value="FFFF";
	var FormButton = document.getElementsByName("bttn"+document.results.Current.value);
	for(var x=0; x<FormButton.length; x++)
	{
		FormButton[x].title=FormButton[x].alt;
		if((parseInt(FormButton[x].value, 16) & NewValue) != 0)
		{
			Buttons(FormButton[x]);
		}
		else
		{
			FormButton[x].style.backgroundColor="#"+document.stuff.ColorNormal.value;
		}
	}
	WhereFrom[0].last.value="";
	Update();
}

function DebugDump(ToThisID, StartAt)
{
	/*Function By James Atherton - http://geckocodes.org/?hacker=James0x57 */
	/*You are free to copy and alter however you'd like so long as you leave the credit intact! =)*/
	var TableRow = "\n<tr><td>Form Name</td><td>Input Type</td><td>Input Name</td><td>Input Title</td><td>Input Alt</td><td title='Input Value'>Input Value</td></tr>";
	var AllInputs = document.getElementsByTagName("input");
	var SA=parseInt(StartAt,10);
	var FullTable=document.getElementById(ToThisID).innerHTML;
	var TableSize=20;
	FullTable="<table border=0 width='100%' style='text-align: center'>"+TableRow;
	for(var x=SA; x<AllInputs.length && x<TableSize+SA; x++)
	{
		var AddThis=TableRow;
		AddThis=AddThis.replace("Form Name", AllInputs[x].form.name);
		AddThis=AddThis.replace("Input Type", AllInputs[x].type);
		AddThis=AddThis.replace("Input Name", AllInputs[x].name);
		AddThis=AddThis.replace("Input Title", AllInputs[x].title);
		AddThis=AddThis.replace("Input Alt", AllInputs[x].alt);
		AddThis=AddThis.replace("Input Value", AllInputs[x].value);
		AddThis=AddThis.replace("Input Value", AllInputs[x].value.substr(0,12));
		FullTable+=AddThis;
	}
	FullTable+="</table><br>&nbsp;Debugger - Dump At Page:";
	for(var x=0; x+(TableSize/2)<AllInputs.length; x+=(TableSize/2))
	{
		if(x%12==0)
			FullTable+="<br>";
		FullTable+="&nbsp;&nbsp;<a href='#' style=\"background: #000000; color: #FFFFFF; font-family: monospace;\" onclick=\"DebugDump('"+ToThisID+"', '"+x+"'); return false;\">"+Number((x/20)).toString(10)+"</a>";
	}
	
	document.getElementById(ToThisID).innerHTML=FullTable+"<br><br>";
}















function RandomColor()
{
	var ms= ((new Date()).getMilliseconds())&7;
	var RRGGBB=((ms&1)?"00":"FF")+((ms&2)?"00":"FF");
	RRGGBB+=(RRGGBB=="FFFF"?"00":RRGGBB=="0000"?"FF":(ms&4)?"FF":"00");
	return RRGGBB;
}