
    const counters = document.querySelectorAll('.units')

    // animated counter 
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('value');//+ for convert string to number
            const count = +counter.innerText;

            if (count < target) {
                counter.innerText = count + 1;
                setInterval(updateCount, 110);
            }
        };
        updateCount();
    });



    //color changer when stack is bellow 10 then it changes to red, when stack is above 10 then its turn to green
    counters.forEach((counter, i) => {
        const value = +counter.getAttribute('value');
        const stack = document.querySelectorAll('.stacks')

        if (value > 10) {
            stack[i].style.backgroundColor = "rgba(0, 128, 0, 0.758)";
            // console.log(stack); 
        }
        else {
            stack[i].style.backgroundColor = "rgba(255, 0, 0, 0.850)";

        }
    })