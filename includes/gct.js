 //this document copyright 2009-2010 James Atherton
 
function trim(Bob)
{
	return Bob.replace(/^\s+|\s+$/g,"");
}


var Code="<a href='#editbox' onclick=\"Edit('c[count]'); return false\">Edit</a> <input type='checkbox' name='t[count]' value='0' onClick=\"Order(this);\"> [codetitle]\n<input type='hidden' name='T[count]' value='[codetitle]'><textarea name='c[count]' rows=5 cols=40 class='hide'>[codebody]</textarea>[hasnote]<div class=note id='n[count]'>[note]</div><br>";

function IsCode(Bob) //bob is the code string
{
	var Code = trim(Bob.replace(/\r/gi, ""));
	var Lines=Code.split("\n");
	for(var i=0; i<Lines.length; i++)
	{
		Lines[i]=trim(Lines[i]);
		if(!(Lines[i].length==17 && Lines[i].charAt(8)==' '))
			return 0;
	}
	Code = Code.replace(/\n/gi, "").replace(/ /gi, "");
	if(Code.length%8!=0)
		return 0;
	for(var i=0; i<Code.length; i++)
	{
		if(!Code.charAt(i).match(/^[A-F0-9]$/))
			return 0;
	}
	return Lines.length; //number of lines in the code
}

function Order(Bob)
{
	if(Bob.checked)
	{
		Bob.value=IsCode(document.gct[Bob.name.replace("t", "c")].value);
		if(Bob.value==0)
		{
			Bob.checked=false;
			Edit(Bob.name.replace("t", "c"));
			location.href="#editbox"; //might be annoying...
			return;
		}
		document.gct.gctorder.value+=Bob.name+' ';
	}
	else
		document.gct.gctorder.value=document.gct.gctorder.value.replace(Bob.name+' ', "");
}

function AddCodes()
{
	var byline;
	var endline="\n";
	byline=document.gct.newcodes.value.replace(/\r/gi, "").replace(/</gi,"").replace(/>/gi,"").split(endline);
	
	var FinalOutput="";
	for(var i=0; i<byline.length; i++)
	{
		var ToWrite=Code;
		var Total=document.gct.total.value;
		if(byline[i]!="")
		{
			ToWrite=ToWrite.replace("[count]", Total);
			ToWrite=ToWrite.replace("[codetitle]", byline[i]);
			ToWrite=ToWrite.replace("[count]", Total);
			ToWrite=ToWrite.replace("[codetitle]", byline[i].ReplaceAll("'", ""));
			ToWrite=ToWrite.replace("[count]", Total);
			ToWrite=ToWrite.replace("[count]", Total);
			ToWrite=ToWrite.replace("[count]", Total);
			i++;
			document.gct.total.value++;
			if(i<byline.length && byline[i]=="" || i==byline.length)
			{
				ToWrite="<div class=sub>"+byline[i-1]+"</div>";
			}
			for(; i<byline.length && byline[i]!="" && trim(byline[i]).length==17 && trim(byline[i]).charAt(8)==' ';  i++)
			{
				ToWrite=ToWrite.replace("[codebody]", trim(byline[i])+endline+"[codebody]");
			}
			ToWrite=ToWrite.replace("[codebody]", "");
									//if(byline[i-1]=="")
									//	i--;
			for(; i<byline.length && byline[i]!=""; i++)
			{
				ToWrite=ToWrite.replace("[note]", trim(byline[i])+"<br>[note]");
				ToWrite=ToWrite.replace("[hasnote]", "<a href='#' onclick=\"Toggle('n"+Total+"'); return false;\">Note</a>");
			}
			ToWrite=ToWrite.replace("[note]", "");
			ToWrite=ToWrite.replace("[hasnote]", "");
			FinalOutput+=ToWrite;
		}
	}
	document.getElementById("gctlist").innerHTML+=FinalOutput;
	document.gct.newcodes.value="";
	
	//re-check selected codes
	byline=trim(document.gct.gctorder.value).split(" ");
	for(var i=0; i<byline.length; i++)
	{
		if(document.gct[byline[i]])
			document.gct[byline[i]].checked=true;
	}
	
	CancelNew(); //hides add more codes box
}

function Edit(Bob)
{
	if(document.gct[Bob])
	{
		document.gct.editarea.value=document.gct[Bob].value;
		document.gct.editing.value=Bob;
		document.gct.editareaTitle.value=document.gct[Bob.replace("c", "T")].value;
		document.gct.editareaNote.value=document.getElementById(Bob.replace("c", "n")).innerHTML.ReplaceAll("<br>", "\n").ReplaceAll("<BR>", "\n");
		document.getElementById("gctedit").style.display = "block";
	}
}

function ApplyEdit()
{
	if(document.gct[document.gct.editing.value] && IsCode(document.gct.editarea.value)!=0)
	{
		document.gct[document.gct.editing.value].value=document.gct.editarea.value;
		document.gct[document.gct.editing.value.replace("c", "t")].value=IsCode(document.gct.editarea.value);
		document.gct.editing.value="";
		document.gct.editarea.value="";
		document.getElementById("gctedit").style.display = "none";
	}
	else
	{
		alert("This is not a code.");
	}
}

function CancelEdit()
{
	document.gct.editing.value="";
	document.gct.editarea.value="";
	document.getElementById("gctedit").style.display = "none";
}

function ShowNew()
{
	document.getElementById("gctnew").style.display = "block";
	location.href="#addcodes";
}

function CancelNew()
{
	document.gct.newcodes.value="";
	document.getElementById("gctnew").style.display = "none";
}

function Toggle(Bob)
{
	if(document.getElementById(Bob).style.display!="block")
		document.getElementById(Bob).style.display = "block";
	else
		document.getElementById(Bob).style.display = "none";
}

function CreateGCT()
{
	document.fin.gctdata.value="00D0C0DE00D0C0DE";
	var Bob=trim(document.gct.gctorder.value).replace(/t/gi,"c").split(" ");
	for(var i=0; i<Bob.length; i++)
	{
		if(document.gct[Bob[i]])
			document.fin.gctdata.value+=document.gct[Bob[i]].value.replace(/\r/gi, "").replace(/\n/gi, "").replace(/ /gi, "");
	}
	if(document.fin.gctdata.value=="00D0C0DE00D0C0DE")
	{
		alert("No codes selected");
	}
	else
	{
		document.fin.gctdata.value+="FF00000000000000";
		document.fin.gctname.value=document.gct.titleid.value;
		//document.gct.newcodes.value=document.fin.gctdata.value; //debug output
		document.fin.submit();
	}
}

/*ReplaceAll function from http://www.codedigest.com*/
String.prototype.ReplaceAll = function(xx,yy){
	var temp = this;
	var index = temp.indexOf(xx);
	while(index != -1){
		temp = temp.replace(xx,yy);
		index = temp.indexOf(xx);
	}
	return temp;
}
