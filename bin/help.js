function loadedFunc(params)
{
	txt += "\n";

	if (params[1] == "me") txt += "You're on your own."; 
	else txt += "There is no help.";

	typeWriter();
}