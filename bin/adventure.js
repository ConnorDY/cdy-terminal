function loadedFunc()
{
	setPrompt(">");
	print(pad+"Type `quit` to quit.");
	return true;
}

function printHelp()
{
	print(
		pad+"[b]Usage:[/b] adventure\n"+
		pad+"Play a text-based adventure game."
	);
}

function receiveInput(input)
{
	switch (input)
	{
		case "quit":
			resetPrompt();
			redirectingInput = false;
			print(pad+"Exited adventure.");
			break;

		default:
			print(pad+"Unknown command.");
	}
	
}