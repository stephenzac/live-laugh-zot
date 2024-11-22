import { db } from "./firebaseConfig";
import { collection, doc, getDoc, getDocs, query, where, updateDoc, arrayUnion, arrayRemove} from 'firebase/firestore';

export class Cost {
    public id: string;
    public title: string;
    public category: string;
    public amount: number;
    public payer: string;

    public constructor(id: string, title: string, category: string, amount: number, payer: string) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.amount = +amount.toFixed(2);
        this.payer = payer;
    }
}

export class Trans {
    public payer: string;
    public paid: string;
    public amount: number;

    public constructor(payer: string, paid: string, amount: number) {
        this.payer = payer;
        this.paid = paid;
        this.amount = +amount.toFixed(2);
    }
} 

export const getCosts = async (householdId: string): Promise<Cost[]> => {
    const houseRef = doc(collection(db, "households"), householdId);
    const houseSnap = await getDoc(houseRef);
    if(houseSnap.exists()){
        return houseSnap.data()["Costs"];
    }
    throw new Error("Household does not exist :(");
};

export const addCost = async(
    householdId: string, id: string, title: string, category: string, amount: number, payer: string
    ) => {
    if (!householdId) {
        throw new Error("No household ID has been provided.");
    }
    if (!id) {
        throw new Error("No Id has been provided.");
    }
    if (!title) {
        throw new Error("No title was given.");
    }
    if (!amount) {
        throw new Error("A payment amount is required.");
    }
    if (!payer) {
        throw new Error("A payer has not been provided.");
    }

    try {
        const cost = new Cost(id, title, category, amount, payer);
        const houseRef = doc(collection(db, "households"), householdId);
        await updateDoc(houseRef, {Costs: arrayUnion(cost)});
    } 
    catch (error) {
        console.error("There was an error adding the cost", error);
        throw error;
    }
}

export const updateCost = async(
    householdId: string, id: string, title: string, category: string, amount: number, payer: string
    ) => {
    if (!id) {
        throw new Error("No Id was given.");
    }

    try {
        const houseRef = doc(collection(db, "households"), householdId);
        const houseSnap = await getDoc(houseRef);
        if(houseSnap.exists()){
            const costs = houseSnap.data()["Costs"];
            const toUpdate = costs.find((i: Cost) => i.id == id);
            if(toUpdate.exists()){
                if(title){
                    toUpdate.title = title;
                }
                if(category){
                    toUpdate.category = category;
                }
                if(amount){
                    toUpdate.amount = +amount.toFixed(2);
                }
                if(payer){
                    toUpdate.payer = payer;
                }
            }
            else{
                throw new Error("Cost with given id does not exist");
            }
        }
        throw new Error("Household does not exist :(");
        
    } 
    catch (error) {
        console.error("There was an error updating the cost", error);
        throw error;
    }
}

export const removeCost = async(householdId: string, id: string) => {
    if (!id) {
        throw new Error("No Id was given.");
    }

    try {
        const houseRef = doc(collection(db, "households"), householdId);
        const houseSnap = await getDoc(houseRef);
        if(houseSnap.exists()){
            const costs = houseSnap.data()["Costs"];
            const toRemove = costs.find((i: Cost) => i.id == id);
            if(toRemove.exists()){
                await updateDoc(houseRef, {Costs: arrayRemove(toRemove)});
            }
            else{
                throw new Error("Cost with given id does not exist");
            }
        }
        throw new Error("Household does not exist :(");
        
    } 
    catch (error) {
        console.error("There was an error removing the cost", error);
        throw error;
    }
}

export const getTrans = async (householdId: string): Promise<Trans[]> => {
    const houseRef = doc(collection(db, "households"), householdId);
    const houseSnap = await getDoc(houseRef);
    if(houseSnap.exists()){
        return houseSnap.data()["Trans"];
    }
    throw new Error("Household does not exist :(");
};

export const addTrans = async(householdId: string, payer: string, paid: string, amount: number) => {
    if (!householdId) {
        throw new Error("No household ID has been provided.");
    }
    if (!payer) {
        throw new Error("Who's paying?");
    }
    if (!paid) {
        throw new Error("Who's getting paid?");
    }
    if (!amount) {
        throw new Error("A payment amount is required.");
    }
    
    try {
        const trans = new Trans(payer, paid, amount);
        const houseRef = doc(collection(db, "households"), householdId);
        await updateDoc(houseRef, {Trans: arrayUnion(trans)});
    } 
    catch (error) {
        console.error("There was an error adding the transaction", error);
        throw error;
    }
}

export const calcTrans = (people: string[], costs: Cost[], transList: Trans[]): number[][] => {
    const numCosts: number = costs.length;
    const numPeople: number = people.length;
    let total: number = 0;

    //find total cost
    for(let i = 0; i < numCosts; i++){
        total += costs[i].amount;
    }

    //find per person cost and how much each person owes overall (can be + or -)
    const perPerson: number = +(total/numCosts).toFixed(2);
    const balances: Map<string, number> = new Map;
    for(const person of people){
        balances.set(person, perPerson);
    }
    for(const cost of costs){
        balances.set(cost.payer, (balances.get(cost.payer) ?? 0) - cost.amount);
    }

    //create 2d array of zeros
    const transactions: number[][] = [];
    for(let i = 0; i < numPeople; i++){
        transactions[i] = [];
        for(let j = 0; j < numPeople; j++){
            transactions[i][j] = 0;
        }
    }

    //while balances are not settled, move as much balance as possible from highest debtor to lowest debtor
    //save transactions in transactions 2d array
    //element i,j=x means i should give j amount x 
    const notZeroed = balances.values().some(balance => balance !== 0);
    const getMax = function (map: Map<string, number>) {
        let max!: [string, number];
        for (const [person, amount] of map) {
           max = (!max[1] || max[1] < amount) ? [person, amount] : max;
        }
        return max;
    }
    const getMin = function (map: Map<string, number>) {
        let min!: [string, number];
        for (const [person, amount] of map) {
           min = (!min[1] || min[1] > amount) ? [person, amount] : min;
        }
        return min;
    }
    while (notZeroed){
        const max = getMax(balances);
        const min = getMin(balances);
        const transAmount: number = Math.min(max[1], -min[1]);
        transactions[people.indexOf(max[0])][people.indexOf(min[0])] += transAmount;
        balances.set(max[0], max[1] - transAmount);
        balances.set(min[0], min[1] + transAmount);
    }

    //subtract what's already been paid
    for(const trans of transList){
        transactions[people.indexOf(trans.payer)][people.indexOf(trans.paid)] -= trans.amount;
    }

    return transactions;
}