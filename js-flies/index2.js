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

		program = (fileData) => {
			return combin1(variableDeclaration, calculateDeclaration)(fileData);
		},


		combin1 = (variable, calc) => {

			return (fileData) => {
				let 
					varResult  = variable(varFunc, identifierList)(fileData),
					calcResult = calc(begin, calcList, end)(varResult.str);

				return varResult.lexems.concat(calcResult);
			}
		},


		//@return list of {lexems} and other part of str
		variableDeclaration = (varFunc, list) => {

			return (fileData) => {

				let 
					indexVar   = fileData.indexOf('var'),
					indexBegin = fileData.indexOf('begin'),
					listLexems = {},
					strVar     = '',
					strList    = '';

				strVar = fileData.substring(indexVar, indexBegin);

				strList = varFunc(strVar);

				listLexems = list(identifier, list)(strList.str);

				return {
					str   : fileData.substr(indexBegin, fileData.length),
					lexems: strList.lexems.concat(listLexems), //делать синтаксис тут
				}
			}
		},


		// END FUNCTION @return {lexem: 'var'} or error connect with var wordkey
		varFunc = (str) => {

			let varCheck = str.indexOf('var');

			if(varCheck == -1){
				throw new Error('var is undefined');
			}else{
				let list = str.replace('var', '');

				if(list[0] != ' ' && list[0] != '\n' && list[0] != '\t' && list[0] != '\r'){
					throw new Error(`expected " " after var, but ${list[0]}`);
				}

				resultLexem.push({lexem: 'var', typeLexem: typeLexem[1]});

				return {
					str   : list,
					lexems: [{lexem: 'var', typeLexem: typeLexem[1]}],
				}
			}
		},


		identifierList = (ident, list) => {
			
			return (str, lexemsList = []) => {

				let 
					separator1Index = str.indexOf(','),
					separator2Index = str.indexOf(';'),
					identifier      = '';

				if(separator1Index == -1){
					//get ;
					if(separator2Index == -1){
						throw new Error('expected ; in the end of variable declaration');
					}

					identifier = str.substring(0, separator2Index);
					let lexem = ident(identifier);
					
					lexemsList.push(lexem);
					lexemsList.push({lexem: ';', typeLexem: typeLexem[2]});

					return lexemsList;
				}else{
					//get ,
					identifier = str.substring(0, separator1Index);
					let lexem = ident(identifier);

					lexemsList.push(lexem);
					lexemsList.push({lexem: ',', typeLexem: typeLexem[2]});

					return list(ident, list)(str.substr(separator1Index + 1, str.length), lexemsList);
				}
				
			}
		},


		// END FUNCTION @return 
		identifier = (str) => {

			let 
				reg   = /[a-z]+\s[a-z]+/g;
				check = reg.test(str);
				lexem = '';

			if(check) throw new Error('expected operator or separator after end of variable');

			str = str.replace(/\s/g, '');

			for(let i = 0; i < str.length; i++){
				if(
					!(str[i].charCodeAt() >= 97 && str[i].charCodeAt() <= 122) 
					&& str[i] != ' ' 
					&& str[i] != '\r'
					&& str[i] != '\n'
					&& str[i] != '\t'
				){
					throw new Error(`${str[i]} is not valid lexem`);
				}else{
					lexem += str[i];
				}
			}

			return {lexem: lexem, typeLexem: typeLexem[3]};
		},


		calculateDeclaration = (begin, calcList, end) => {
			
			return (str) => {
				let 
					beginResult    = {},
					calcListResult = {},	
					strCalcList    = '',
					strBegin       = '',
					strEnd         = '';

				beginResult    = begin(str);
				calcListResult = calcList(calc, calcList)(beginResult.str);
				endResult      = end(calcListResult.str);

				return [].concat(beginResult.lexem).concat(calcListResult.lexems).concat(endResult);
				
			}
		},


		begin = (str) => {

			let beginIndex  = str.indexOf('begin');

			if(beginIndex == -1){
				throw new Error('begin is undefined');
			}

			resultLexem.push({lexem: 'begin', typeLexem: typeLexem[2]});

			return {
				lexem: {lexem: 'begin', typeLexem: typeLexem[2]},
				str  : str.replace('begin', ''),
			}
		},


		end = (str) => {
			let endIndex = str.indexOf('end');

			if(endIndex == -1){
				throw new Error('end is undefined');
			}

			resultLexem.push({lexem: 'end', typeLexem: typeLexem[2]});

			return {lexem: 'end', typeLexem: typeLexem[2]};
		},


		calcList = (calc, list, resultList = []) => {
			
			return (str, lexems = []) => {

				let 
					separatorIndex = str.indexOf(';'),
					calcStr        = '',
					calcResult     = {};

				calcStr    = str.substr(0, separatorIndex + 1);
				calcResult = calc(identifier, equal, rightCalc)(calcStr);

				lexems = lexems.concat(calcResult);

				str = str.replace(calcStr, '');

				if(str.indexOf(';') != -1){
					return calcList(calc, list, resultList)(str, lexems);
				}else{
					return {
						lexems: lexems, 
						str   : str,
					};
				}
				
			}
		},


		calc = (ident, equalFunc, rightCalcFunc) => {

			return (str) => {

				let
					equalIndex   = str.indexOf('='),
					lexems       = [],
					rightCalcRes = {};

				lexems.push(ident(str.substring(0, equalIndex)));
				lexems.push(equalFunc(str.substring(equalIndex, equalIndex + 1)));
				
				rightCalcRes = rightCalcFunc(ident, rightCalcFunc)(str.substring(equalIndex + 1, str.length));

				return lexems.concat(rightCalcRes);
			}
		},


		equal = (str) => {
			let eqCheck = str.indexOf('=');

			if(eqCheck == -1){
				throw new Error('expected `=` in declaration line');
			}

			return {lexem: '=', typeLexem: typeLexem[4]};
		},


		rightCalc = (ident, rightCalcFunc) => {

			return (str, lexems = [], identStr = '') => {
				let
					symbol = str[0];
				
				str = str.substring(1, str.length);

				switch(symbol){
					case '!': case '|': case '&': case '^':
						identStr = identStr.replace(/\s/g, '');
						if(identStr != '') lexems.push(ident(identStr));
						lexems.push({lexem: symbol, typeLexem: typeLexem[4]});
						return rightCalcFunc(identifier, rightCalcFunc)(str, lexems);
						break;
					case '1': case '0':
						identStr = identStr.replace(/\s/g, '');
						if(identStr != '')  lexems.push(ident(identStr));
						lexems.push({lexem: symbol, typeLexem: typeLexem[0]});
						return rightCalcFunc(identifier, rightCalcFunc)(str, lexems);
						break;
					case '(': case ')':
						identStr = identStr.replace(/\s/g, '');
						if(identStr != '')  lexems.push(ident(identStr));
						lexems.push({lexem: symbol, typeLexem: typeLexem[2]});
						return rightCalcFunc(identifier, rightCalcFunc)(str, lexems);
						break;
					case ';':
						lexems.push({lexem: symbol, typeLexem: typeLexem[2]});
						return lexems;
					default:
						identStr += symbol;
						return rightCalcFunc(identifier, rightCalcFunc)(str, lexems, identStr);
				}
			}
			
		};

	console.log(program(fileData));

}

main();

//ошибка с begin - разобраться!!!!
//апликативное программирование -> понять что такое
//разобрать пример по парсер комбинаторам - напомнить через пару дней
//формальные грамматики, форма Хомского, то, что идет до нее,  