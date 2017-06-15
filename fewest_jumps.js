var start_sim_button = document.querySelector(".start_sim_button");
start_sim_button.disabled = false;
start_sim_button.addEventListener('click', function()
	{
		start_sim(10);
	});
// Visuals
// Generating random array
var start_sim = function(max_index)
{
	if (max_index < 1)
	{
		return true;
	}
	start_sim_button.disabled = true;
	var array = [];
	var pointer_node = document.querySelector(".pointer");
	var step_node = document.querySelector(".step");
	var current_reach_node = document.querySelector(".current_reach");
	var max_reach_node = document.querySelector(".max_reach");
	var max_reach_operation_node = document.querySelector(".max_reach_operation"); 
	var current_reach_bar = document.querySelector(".current_reach_bar"); 
	var max_reach_bar = document.querySelector(".max_reach_bar"); 
	var jump_curve_node = document.querySelector(".jump_curve");
	var completion_status_node = document.querySelector(".sim_completion");
	var $final_step = document.querySelector(".final_step"); 
	
	// reseting animation
	pointer_node.innerHTML = max_reach_node.innerHTML = step_node.innerHTML = current_reach_node.innerHTML = 0;
	max_reach_operation_node.innerHTML = "0 + 0";
	max_reach_bar.style.width = current_reach_bar.style.width = "0px";
	document.querySelector(".sim_completion_y").style.display = "none";
	document.querySelector(".sim_completion_n").style.display = "none";
	for (var l = 0; l < 11; l++)
	{
		var choice = Math.floor(Math.random() * 5);
		array.push(choice);
	}
	// Animating generation of array
	var els = document.querySelectorAll(".array_el");
	var timer = 20;
	var array_gen_interval = setInterval(function()
	{
		var nums = [1,2,3,4,5,6,7,8,9];
		for (var i = 0; i < els.length; i++)
		{
			var j = Math.floor(Math.random() * nums.length);
			els[i].innerHTML = nums[j];
		}		
		setTimeout(function()
		{
			clearInterval(array_gen_interval);
			for (var i = 0; i < 11; i++)
			{
				els[i].innerHTML = array[i];
			}
		}, 1000)	
	}, timer)

	// Cleaning up previous animation
	for (var i = 0; i < els.length; i++) 
	{
		els[i].classList.remove("active");
		els[i].classList.remove("max");
		els[i].classList.remove("current");	
	}
	$final_step.style.display = "none";
	step_node.classList.remove("final");
	// animating algorithm
	var max_index = 10;
	var steps = [0];
	animate_algo(max_index)
	function animate_algo(max_index)
	{
		// Base case for recusion: we have made as many recusrive calls as there are jumps to reach the end of the array
		if (steps[1] === steps.length)
		{
			start_sim_button.disabled = false;
			// Final number of steps
			console.log(steps[1])
			$final_step.innerHTML = "Final Number of jumps: " + steps[1];
			$final_step.style.display = "block";
			return 1;
		}
		setTimeout(function ()
		{
			// make one iteration
			function iterate(max_index)
			{
				// Updating pointer
				pointer++;
				var i = pointer - 1;
				pointer_node.innerHTML = pointer;
				if (pointer > 0)
				{
					els[pointer - 1].classList.remove("max");
					els[pointer - 1].classList.add("active");
				}
				if (pointer > 1)
				{
					els[pointer - 2].classList.remove("active");
				}
				// If current max jump is enough to push us over the end of the array, store index
				if (reach >= max_index)
				{
					last_jump.push(i - 1);
				}
				// Updating step if need be & current_reach
				if (i > lastReach)
				{
					//var idx_curr = Math.min(10, lastReach);
					//els[idx_curr].classList.remove("current");
					step++;
					lastReach = reach;
					step_node.innerHTML = step;
					current_reach_node.innerHTML = lastReach + 1;
					width_current = 20 * lastReach;
					current_reach_bar.style.width = width_current + "px";
					// Updating visual cue of current reach on array
					//idx_curr = Math.min(10, lastReach);				
					//els[idx_curr].classList.add("current");
				}	
				// Updating maximum recorded reach
				var idx_max = Math.min(10, reach);	
				els[idx_max].classList.remove("max");
				reach = Math.max(reach, array[i] + i);
				max_reach_operation_node.innerHTML = i + "+" + array[i];
				max_reach_node.innerHTML = reach + 1;
				var width_max = 20 * reach;
				max_reach_bar.style.width = width_max + "px"; 
				// Updating visual cue of max reach on array
				idx_max = Math.min(10, reach);				
				els[idx_max].classList.add("max");


				// Ending loop if we are at the end of the array
				if (pointer >= max_index + 1 || (array[i] === 0 && reach <= i) || array[0] === 0)
				{
					clearInterval(loop_interval);
					// reporting completion status of sim if first recursion was successful in reaching the end of the array
					if (max_index >= 10)
					{
						var completion = (i < array.length - 1) ? 0 : 1;
						if (completion)
						{
							var completion_node = document.querySelector(".sim_completion_y");
						}
						else
						{
							start_sim_button.disabled = false;
							var completion_node = document.querySelector(".sim_completion_n");
						}
						completion_node.style.display = "block";
					}
					// Cleaning up colored boxes
					for (var i = 0; i < els.length; i++) 
					{
						els[i].classList.remove("active");
						els[i].classList.remove("max");
						//els[i].classList.remove("current");	
					}
					// Recursion 
					if (reach >= max_index)
					{
						var l_jump = last_jump[0];
						console.log("last jump " + l_jump);
						max_index = l_jump;
						steps.push(step);
						els[l_jump].classList.add("current");	
						animate_algo(l_jump);
					}	
					// Final number of steps
					step_node.innerHTML = (steps[0] === "undefined") ? "N/A" : steps[0];
				}
			}

			var max_list = document.querySelector(".max_reach_display");
			var pointer = 0;
			var reach = array[0];
			var step = 0;
			var lastReach = 0;
			var last_jump = [];
			var loop_interval = setInterval(iterate, 1000, max_index);
			// Allowing for refire of simulation
		}, 500)			
	}
}
