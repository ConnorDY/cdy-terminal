var knownCommands = [
	"help", "shutdown", "reboot",
	"setcolor", "source"
];

function loadedFunc(params)
{
	if (params.length == 2)
	{
		switch (params[1])
		{
			case "me":
				print(pad+"You're on your own.");
				break;

			case "help":
				print(pad+"Seriously?");
				break;

			default:
				executingCommand = true;
				$.loadScript("./bin/" + params[1] + ".js", () =>
				{
					printHelp();
					executingCommand = false;
				}, () =>
				{
					print(pad+"There is no help for that command.");
					executingCommand = false;
				});
		}
	}
	else if (params.length != 1)
	{
		print(pad+"Help you with what now?");
	}
	else
	{
		printBuffer(pad+"The following commands are available:\n"+pad);

		knownCommands.forEach((command, index) =>
		{
			printBuffer(command);
			if (index < knownCommands.length - 1) printBuffer(", ");
		});

		print("");
	}
}