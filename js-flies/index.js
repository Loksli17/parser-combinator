//классы лексем
/*
итендификаторы
константы
ключевые слова
знаки операций
разделители
*/




const fs = require('fs');


let main = () => {

	const 
		fileData    = fs.readFileSync('data.txt', 'utf-8'),
		resultLexem = [],
		errors      = [],
		typeLexem   = [
			'const',
			'keyword',
			'separator',
			'identifier',
			'operator',
		],


	countRows = (str = "") => {
		return str.split('\r').length - 1;
	},


	program = (fileData = "", variableDeclaration, calculateDeclaration) => {

		let
			indexVar     = 0,
			indexBegin   = 0,
			indexEnd     = 0,
			strVariables = '',
			strCalculate = '';

		indexBegin = fileData.indexOf('begin');
		indexVar   = fileData.indexOf('var');
		indexEnd   = fileData.indexOf('end');

		if(indexVar == -1){
			errors.push({lexem: 'var', message: 'is not defined'});
			return;
		}

		if(indexBegin == -1){
			errors.push({lexem: 'begin', message: 'is not defined'});
			return;
		}

		if(indexEnd == -1){
			errors.push({lexem: 'end', message: 'is not defined'});
			return;
		}

		strVariables = fileData.substr(indexVar,   indexBegin - 1);
		strCalculate = fileData.substr(indexBegin, indexEnd + 'end'.length);

		variableDeclaration(strVariables, listAssignment); 
		calculateDeclaration(countRows(strVariables), strCalculate, listAssignment);

	},


	variableDeclaration = (strVariables, listAssignment) => {

		let list = strVariables.replace('var', '');
		resultLexem.push({lexem: 'var', type: typeLexem[1]});
		listVariables(list);
	},


	listVariables = (list) => {

		//переделать

		let 
			countRows = 1,
			variable  = '';

		if(list[0] != ' ' && list[0] != '\n' && list[0] != '\t'){
			errors.push({rowNumber: countRows, message: 'i want space or \n or \t before var'});
		}
		
		for(let i = 0; i < list.length; i++){
			if(list[i].charCodeAt() >= 97 && list[i].charCodeAt() <= 122){
				variable += list[i];
			}else if(list[i] == ',' || list[i] == ';'){
				resultLexem.push({lexem: variable, type: typeLexem[3]});
				variable = '';
				resultLexem.push({lexem: list[i], type: typeLexem[2]});
			}else if(list[i] == '\r'){
				countRows++;
			}else if(list[i] != ' ' && list[i] != '\n' && list[i] != '\t'){
				errors.push({lexem: list[i], message: 'this lexem is not valid', rowNumber: countRows});
			}
		}
	},


	calculateDeclaration = (countRows, strCalculate, listAssignment) => {

		let list = strCalculate.replace('begin', '');
		list = list.replace('end');

		resultLexem.push({lexem: 'begin', type: typeLexem[2]});
		listAssignment(countRows + 1, list, assignment);
		resultLexem.push({lexem: 'end', type: typeLexem[2]});
	},


	listAssignment = (countRows, list, assignment) => {

		let strAssignment = '';

		for(let i = 0; i < list.length; i++){
			if(list[i] != ';' && list[i] != '\n'){
				strAssignment += list[i];
			}else if(list[i] == '\n'){
				countRows++;
			}else if(list[i] == ';'){
				assignment(countRows, strAssignment, variable, expression);
				strAssignment = '';
			}
		}
	},


	assignment = (countRows, assignment, variable, expression) => {

		let 
			eqOperIndex   = assignment.indexOf('='),
			strExpression = '',
			strVariable   = '';

		strVariable = assignment.substr(0, eqOperIndex - 1);
		strExpression   = assignment.substr(eqOperIndex, assignment.length);

		variable(countRows, strVariable);
		expression(countRows, strExpression, subexpression, unaryOperator);

	},


	variable = (countRows, strVariable) => {
		let variable = strVariable.replace(/\s/g, '');

		for(let i = 0; i < strVariable.length; i++){
			if(
				!(strVariable[i].charCodeAt() >= 97 && strVariable[i].charCodeAt() <= 122) 
				&& strVariable[i] != ' ' 
				&& strVariable[i] != '\r'
				&& strVariable[i] != '\t'
			){
				errors.push({lexem: strVariable[i], message: 'this lexem is not valid', rowNumber: countRows});
				return;
			}
		}

		resultLexem.push({lexem: variable, type: typeLexem[3]});
	},

	
	expression = (countRows, strExpression, subexpression) => {

		let 
			indexUnary       = strExpression.indexOf('!'),
			countUnary       = 0,
			strUnary         = '',
			strSubexpression = ''; 

		resultLexem.push({lexem: strExpression[0], type: typeLexem[4]});

		countUnary = strExpression.split('!').length - 1;

		console.log(countUnary);

		if(indexUnary != -1){
			strUnary         = strExpression.substr(0, indexUnary);
			strSubexpression = strExpression.substr(indexUnary + 1, strExpression.length);

			unaryOperator(strUnary);
			subexpression(strSubexpression);
		}else{
			subexpression(strExpression);
		}
	},


	unaryOperator = (strUnary) => {
		resultLexem.push({lexem: '!', type: typeLexem[2]});
	}


	subexpression = (strSubexpression) => {

	};


	program(fileData, variableDeclaration, calculateDeclaration);

	console.log(resultLexem, errors);
	
}


main();


			// for(let i = 0; i < list.length; i++){
			// 	if(list[i].charCodeAt() >= 97 && list[i].charCodeAt() <= 122){
			// 		variable += list[i];
			// 	}else if(list[i].charCodeAt() >= 48 && list[i].charCodeAt() <= 57){
			// 		if(variable != '') resultLexem.push({lexem: variable, type: typeLexem[3]});
			// 		variable = '';
			// 		resultLexem.push({lexem: list[i], type: typeLexem[0]});
			// 	}else if(list[i] == '=' || list[i] == '&' || list[i] == '^' || list[i] == '|' || list[i] == '!'){
			// 		if(variable != '') resultLexem.push({lexem: variable, type: typeLexem[3]});
			// 		variable = '';
			// 		resultLexem.push({lexem: list[i], type: typeLexem[4]});
			// 	}else if(list[i] == '(' || list[i] == ')' || list[i] == ';'){
			// 		if(variable != '') resultLexem.push({lexem: variable, type: typeLexem[3]});
			// 		variable = '';
			// 		resultLexem.push({lexem: list[i], type: typeLexem[2]});
			// 	}else if(list[i] == '\r'){
			// 		countRows++;
			// 	}else if(list[i] != ' ' && list[i] != '\n' && list[i] != '\t'){
			// 		errors.push({lexem: list[i], message: 'this lexem is not valid', rowNumber: countRows});
			// 	}
			// }


