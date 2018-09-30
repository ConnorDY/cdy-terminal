var knownCommands = [
	"help", "shutdown", "reboot",
	"source"
];

function loadedFunc(params)
{
	txt += "\n";

	if (params[1] == "me") txt += "You're on your own."; 
	else
	{
		txt += "The following commands are available:\n";
		knownCommands.forEach((command, index) =>
		{
			txt += command;
			if (index < knownCommands.length - 1) txt += ", ";
		});
	}

	typeWriter();
}