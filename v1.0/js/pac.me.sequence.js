Pac('sequence', function (props, me, delegate)
{
    function stop()
    {
        me.stop(); if (delegate) delegate();
    }

	function play(i)
	{
	    if (!props.set[i] || !props.set[i].name) return stop();

		var handle = props.set[i];

		if (!handle || !handle.play)
		{
			handle = props.set[hash[props.set[i].name]];
		}

		if (!handle || !handle.play) return stop();

		var source = fix((props.set[prev]) ? props.set[prev].props : {}, {}), target = me.fix(handle.props, {}), set = me.copy(source, target);
		
		me.play(function ()
		{
			if (!handle.play(set, me))
			{
				props.set[prev = i].props = set; play(i + 1);
			}
		});
	}

	var hash = {}, prev;

	for (var i = 0; i < props.set.length; i++)
	{
	    if (props.set[i] && props.set[i].play) hash[props.set[i].name] = i;
	}
	
	play(0);
});