var txt;
var typeSpeed = 25;
var blinkSpeed = 300;
var typePos = 0;
var args = [];

function init()
{
	txt = $("#textToDisplay").text();
	txt = txt.replace(/\t/g, ""); // remove tabs
	txt = txt.substr(1, txt.length-2); // remove first and last newlines

	setTimeout(typeWriter, 400);
	setTimeout(blinkBlock, blinkSpeed);

	$("#capInput").on("change paste keyup", handleTyping);
	$("#capInput").keydown(handleInput);

	$("body").click(() =>
	{
		$("#capInput").focus();
	});
}

function typeWriter()
{
	$("#capInput").blur();

	if (typePos < txt.length)
	{
		$("#termText").append(txt.charAt(typePos));
		typePos++;
		setTimeout(typeWriter, typeSpeed);
	}
	else
	{
		$("#acceptInput").css("display", "inline");
		$("#capInput").focus();
	}

	// scroll to bottom
	var content = $("#content");
	content.scrollTop(content[0].scrollHeight);
}

function blinkBlock()
{
	var enc = $("#blockChar");

	if (enc.css("visibility") == "hidden") enc.css("visibility", "visible");
	else enc.css("visibility", "hidden");

	setTimeout(blinkBlock, blinkSpeed);
}

function handleTyping()
{
	$("#userInput").html($("#capInput").val());
}

function handleInput(event)
{
	if (event.which == 13) // enter key is pressed
	{
		var input = $("#capInput");

		// trim input
		input.val(input.val().trim());

		// hide input field then display the input
		$("#acceptInput").css("display", "none");
		$("#termText").append("\n# " + input.val());

		// process input
		args = input.val().split(" ");

		switch (args[0])
		{
			case "clear":
				$("#termText").html("");
				txt = "";
				typePos = 0;
				typeWriter();
				break;

			case "":
				typeWriter();
				break;

			default:
				$.loadScript("./bin/" + args[0] + ".js", () =>
				{
					loadedFunc();
				}, () =>
				{
					txt += "\nCould not execute `" + args[0] + ".js` (Error 404: File not found)";
					typeWriter();
				});
		}

		// clear input
		input.val("");
	}

	handleTyping();
}

jQuery.loadScript = (url, callback, failed) =>
{
    jQuery.ajax({
        url: url,
        dataType: "script",
        success: callback,
        error: failed,
        async: true
    });
}