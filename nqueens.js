//define n for number of queens and N x N board
const N = 10;
const GEN_SIZE = 150
const SELECTION_FACTOR = 5;
const SIM_NUM = 500;
const BOX = 45
const SIM_SPEED = 10;

//create node for a given board
function getNode(state){
    var newNode = {
        state: state,
        fitness: getFitness(state)
    };
    return newNode;
};

//create random function creates random numbers from 0 to (max - 1)
function getRandomInt(max){
    return Math.floor(Math.random() * max);
}

//make function to get the state of the board
function getState(){
    var arr = [];
    for(var i = 0; i < N; i++){
        arr.push(getRandomInt(N));
    }
    return arr;
}

//function to calculate number of queens that are in line of attack by another queen
function getFitness(arr){
    var count = 0; 
    var fit_level = 0;
    //Scan horizontally
    for(var i = 0; i < N; i++){
        for(var j = 0; j < arr.length; j++){
            if(arr[j] == i){
                count++;
            }
        }
        if(count >= 2){
            fit_level += (count - 1);
        }
        count = 0;
    }
    //Scan diagnally
    for(var i = 0; i < (arr.length - 1); i++){
        var next = i + 1;
        var num = 1;
        //Scan upward diagnally
        for(j = 0; j < arr[i]; j++){
            if(arr[next] == arr[i] - num){
                fit_level++;
                break;
            }
            next++;
            num++;
            if((arr[i] - num) < 0){
                break;
            }
        }
        next = i + 1;
        num = 1;
        //Scan downward diagnally
        for(j = 0; j < ((N-1) - arr[i]); j++){
            if(arr[next] == arr[i] + num){
                fit_level++;
                break;
            }
            next++;
            num++;
            if((arr[i] + num) > (N-1)){
                break;
            }
        }
    }
    return fit_level;
}


//randomly selects parents from the population size who have a better fitness score
function getParents(gen){
    let parents = [];
    let rand;
    let randIndex;
    for(i = 0; i < 2; i++){
        rand = Math.random();
        randIndex = parseInt(GEN_SIZE * Math.pow(rand, SELECTION_FACTOR), 10);
        parents.push(gen[randIndex]);
    }
    
    return parents;
}
function getChildren(parents){
    let children = [];
    let parent1 = parents[0].state;
    let parent2 = parents[1].state;
    let child1 = [];
    let child2 = [];
    let crossover = getRandomInt(N - 1) + 1; // 1 through 9 possible
    let mutationChance = getRandomInt(N) + 1; // 80% chance to be mutated

    //children will be a combination of both parents will split parents data based on the crossover point
    for(var i = 0; i < crossover; i++){
        child1.push(parent1[i]);
        child2.push(parent2[i]);
    }
    for(var i = crossover; i < N; i++){
        child1.push(parent2[i]);
        child2.push(parent1[i]);
    }
    //80% chance for each child to have a mutation
    if(mutationChance <= 8){
        child1[getRandomInt(N)] = getRandomInt(N);
    }

    mutationChance = getRandomInt(N) + 1;
    if(mutationChance <= 8){
        child2[getRandomInt(N)] = getRandomInt(N);
    }

    children.push(getNode(child1));
    children.push(getNode(child2));
    return children;
}





//make canvas
var canvas = document.getElementById("board");
var ctx = canvas.getContext("2d");

const board = new Image();
const queen = new Image();
board.src = "images/board.jpg";
queen.src = "images/queen.png"

//place 150 nodes in an array
var firstGen = [];
for(var i = 0; i < GEN_SIZE; i++){
    firstGen.push(getNode(getState()));
}
//sort nodes by fitness
firstGen.sort((a, b) => a.fitness - b.fitness);

var currentGen = [...firstGen];

var count = 0;

function draw(){
    ctx.drawImage(board, 0, 0);
    

    var newGen = [];
    var parents = [];
    var children = [];

        //create new generation
        for(var j = 0; j < GEN_SIZE/2; j++){
            parents = getParents(currentGen);
            children = getChildren(parents);
            newGen.push(children[0]);
            newGen.push(children[1]);
        }
        newGen.sort((a, b) => a.fitness - b.fitness);
        currentGen = [...newGen];
        newGen = []; 
        //draw queens on the canvas
        position = currentGen[0].state;
        for(let i = 0; i < N; i++){
            ctx.drawImage(queen, BOX*i, BOX*position[i])
        }
        ctx.fillStyle = 'rgb(50, 50, 50)';
        ctx.fillRect(0, 450, 600, 100);
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Gens: " + count, 45, 485);
        ctx.fillText("Fitness: " + currentGen[0].fitness, 270, 485);
        count++;

        if(currentGen[0].fitness == 0){
            clearInterval(game);
        }
}
let game = setInterval(draw, SIM_SPEED);

