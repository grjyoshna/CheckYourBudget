var budgetController = (function(){
	var Expense=function(id,description,value)
	{
		this.id=id;
		this.description=description;
		this.value=value;
		this.percentage=-1;
	};
	Expense.prototype.calPercentage=function(totalIncome){
		if(totalIncome>0)
			{
					this.percentage=Math.round((this.value/totalIncome)*100);
				
			}
		else{
			this.percentage=-1;
		}
	};
	Expense.prototype.getPercentage=function(){
		console.log(this.percentage);
		return this.percentage;
	}
	var Income=function(id,description,value)
	{
		this.id=id;
		this.description=description;
		this.value=value;
	};
	var calculteTotal=function(type){
		var sum=0;
		data.allItems[type].forEach(function(cur){
									sum+=cur.value;
									});
		data.totals[type]=sum;
	};
	
	var data={
		allItems:{
			exp:[],
			inc:[]
		},
		totals:{
			exp:0,
			inc:0
		},
		budget:0,
		percentage:-1
	};
	
	return{
		addItem: function(type,des, val)
		{
			var newItem, ID;
			if(data.allItems[type].length>0)	
				{
					ID=data.allItems[type].length;
					
				}
			else{
				ID=0;
			}
			
			if(type==='exp')
				{
					newItem=new Expense(ID,des,val);
				}
			else if(type==='inc')
				{
					newItem=new Income(ID, des, val);
				}
			data.allItems[type].push(newItem);
			return newItem;
		},
		deleteItem: function(type,id){
			
			var ids=data.allItems[type].map(function(current){
				return current.id;
			})
			var index=ids.indexOf(id);
			
			data.allItems[type].splice(index,1);
		},
		calculateBudget: function(){
				calculteTotal('inc');
				calculteTotal('exp');
				//calculte budget
				data.budget=data.totals.inc-data.totals.exp;
				//calculate percentage
				if(data.totals.inc>0){
				data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
				}
				else{
					data.percentage=-1;
				}
			
		},
		calculatePercentage: function(){
			data.allItems.exp.forEach(function(cur){
					cur.calPercentage(data.totals.inc);	
				 }	)
		},
		getPercentages: function(){
			var percs=data.allItems.exp.map(function(cur){
											return cur.getPercentage();
											})
			return percs;
		},
		budget:function()
		{
			return{
				totalIncome:data.totals.inc,
				totalExpense:data.totals.exp,
				budget:data.budget,
				percentage:data.percentage
			};
		},
		testing: function(){
			return data;
		}
	
		
	}
		
})();



var UIController=(function(){
		var DOMstrings={
			inputType:'.add__type',
			inputDescription:'.add__description',
			inputValue:'.add__value',
			inputBtn:'.add__btn',
			incomeContainer:'.income__list',
			expensesContainer:'.expenses__list',
			budgetLabel: '.budget__value',
			incomeLabel:'.budget__income--value',
			expensesLabel:'.budget__expenses--value',
			percentagesLabel:'.budget__expenses--percentage',
			container:'.container',
			displayPercLabel:'.item__percentage',
			disDate: '.budget__title--month'
		}
		var formatNumber=function(num,type){
			var numSplit,int,dec;
			num=Math.abs(num);
		
			//format number with exactly two decimal points
			num=num.toFixed(2);
			numSplit=num.split('.');
			int=numSplit[0];
			dec=numSplit[1];
			//comma seperating the thousands
			if(int.length>3)
				{
					int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
				}
			return (type==='exp'?'-':'+')+int+'.'+dec;
			
		};
		var nodeListforeach=function(list,callBack){
						for(var i=0;i<list.length;i++){
							callBack(list[i],i);	
						}
				};
	return{
		getInput:function(){
		return{
			type:document.querySelector(DOMstrings.inputType).value,
			description:document.querySelector(DOMstrings.inputDescription).value,
			value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
		};
		
		},
		
		getDOMstrings: function(){
		return DOMstrings;
	},
		addListItem:function(obj,type){
			var html, newHtml, element;
			//1. create html string with placeholder
			if(type==='inc')
				{
					element=DOMstrings.incomeContainer;
					html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>  </div></div> </div>'
				}
			else if(type==='exp')
				{
					element=DOMstrings.expensesContainer;
					html='<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div>  <div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div></div>'
				}
			//2. Replace the place holder with 	
			newHtml=html.replace('%id%',obj.id);
			newHtml=newHtml.replace('%description%',obj.description);
			newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));
			//3. Add the item to html
			//console.log(newHtml);
			document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
			
		},
		deleteListItem: function(selectorID){
			var el=document.getElementById(selectorID);
			el.parentNode.removeChild(el);
		},
		clearFields: function(){
			var fields, fieldsArr;
			fields=document.querySelectorAll(DOMstrings.inputDescription+", "+DOMstrings.inputValue);
			fieldsArr=Array.prototype.slice.call(fields);
			fieldsArr.forEach(function(current, index,array)
			{
					current.value="";
			});
			fieldsArr[0].focus();
		},
		updatebudget: function(obj){
			var type;
			if(obj.budget>0){
				type='inc';
			}
			else{
				type='exp';
			}
			document.querySelector(DOMstrings.budgetLabel).textContent=formatNumber(obj.budget,type);
			document.querySelector(DOMstrings.incomeLabel).textContent=formatNumber(obj.totalIncome,'inc');
			document.querySelector(DOMstrings.expensesLabel).textContent=formatNumber(obj.totalExpense,'exp');
				if(obj.percentage>0){
					document.querySelector(DOMstrings.percentagesLabel).textContent=obj.percentage+"%";
				}
				else{
					document.querySelector(DOMstrings.percentagesLabel).textContent='___';
				}
			
		},
		displayPercentages: function(percentages){
				var fields=document.querySelectorAll(DOMstrings.displayPercLabel);
				
				
				nodeListforeach(fields,function(currrent,index){
					if(percentages[index]>0){
						currrent.textContent=percentages[index]+"%";
					}else{
						currrent.textContent='---';
					}
					
				});
				
		},
		diplayDate: function(){
			var now, year, month;
			now=new Date();
			year = now.getFullYear();
			month=now.getMonth();
			months=['January', 'Febrauary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			document.querySelector(DOMstrings.disDate).textContent=months[month]+', '+year;
		},
		changedType: function(){
			var fields=document.querySelectorAll(
			DOMstrings.inputType+','+
			DOMstrings.inputDescription+','+
			DOMstrings.inputValue
			);	
			
			nodeListforeach(fields,function(cur){
				cur.classList.toggle('red-focus');
			})
			document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
		},
		getDOMstrings: function(){
			return DOMstrings;
		}
	}
})();

var updatePercentages=function(){
	//1. Calculate the percentages
		budgetController.calculatePercentage();
	
	//2. 
	var p= budgetController.getPercentages();
	//3. Update the UI with new percentage
	UIController.displayPercentages(p);
	
}
var updateBudget=function()
{
	//1. calculate the budget
	budgetController.calculateBudget();
	//2. Return the budget
	var budget=budgetController.budget();
	//3. Display the budget on the UI
	UIController.updatebudget(budget);
	
};

var controller=(function(budgetCtrl,UICtrl){
	var DOM=UICtrl.getDOMstrings();
	
	var setUpEventListeners=function()
	{
			document.querySelector(	DOM.inputBtn).addEventListener('click',ctrlAddItem);
		document.addEventListener('keypress',function(event){
		if(event.keyCode==13||event.which==13)
		{
		ctrlAddItem();
		}
		});
		document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
		document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType);
	};
	
	
	var ctrlAddItem=function(){
		//1. Get Input data
		var input=UICtrl.getInput();
		if(input.description!=="" && !isNaN(input.value) && input.value>0)
			{
				//2. Add new Item
				var newItem=budgetCtrl.addItem(input.type,input.description,input.value);
				console.log(newItem);
				//3. add item to the UI
				UICtrl.addListItem(newItem,input.type);
				//4. clear input fields
				UICtrl.clearFields();
				
				//5. calculate and update the budget
				updateBudget(budgetCtrl);
				//6. Update the percentages
				updatePercentages();
				
			}
	};
	var ctrlDeleteItem=function(event){
		var itemId;
		itemId=event.target.parentNode.parentNode.parentNode.parentNode.id;
				if(itemId)
					{
						
						splitID=itemId.split('-');
						type=splitID[0];
						ID=parseInt(splitID[1]);
						
						//1. Delete  the item from the data structure
						budgetCtrl.deleteItem(type,ID);
						//2. Delete the item from the UI
						UICtrl.deleteListItem(itemId);
						//3. UPdate and display the new budget
						updateBudget();
						//4. Update the percentages
						updatePercentages();
					}
		};
	
	
	
	return{
		init: function(){
			console.log('Application has started');
			setUpEventListeners();
			UICtrl.diplayDate();
			UICtrl.updatebudget({
				totalIncome:0,
				totalExpense:0,
				budget:0,
				percentage:0
			});
		}
	}
	
})(budgetController,UIController);

controller.init();