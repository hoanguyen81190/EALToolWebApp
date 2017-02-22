import store from '../../core/store';
import {eALDocument} from '../../database-loader';
import Button from '../../components/Button';

import s from './styles.css';

import history from '../../core/history';

const React = require('react');

class Condition extends React.Component {
  render() {
    if(this.props.object.type === "Leaf") {
      var element =
         <div className={s.conditionLeafText} dangerouslySetInnerHTML={{__html: this.props.object.description.text}}/>;
      return element;
    }
    else {
      var element =
       <div>
         {
           this.props.object.children.map((ele, index) => {
             if(index != this.props.object.children.length - 1) {
               return <div key={index}>
                 <Condition object = {ele} index = {index}/>
                 <div className={s.operator}>{this.props.object.type}</div>
               </div>;
             }
             return <div key={index}>
               <Condition object = {ele} index = {index}/>
             </div>;
           })
         }
      </div>;
      return element;
    }
  }
}

class AlertLevel extends React.Component {
  render() {
    var ele = <div className={s.alertLevel}>
      <div className={s.alertLevelText} dangerouslySetInnerHTML={{__html: this.props.content.level}}/>
      <Condition object={this.props.content.conditions}/>
    </div>;
    return ele;
  }
}

class Criterion extends React.Component {
  constructor() {
    super();
  }

  handleClick(criterion) {
    var action = {
      type : 'SET_STATE',
      mode : store.getState().mode,
      recognitionCategory : store.getState().recognitionCategory,
      emergencyLevel : this.props.emergencyLevel,
      criterionObject: criterion
    }
    store.dispatch(action);

    history.push("/classifying");
  }

  render() {
    var details;
    if (this.props.showDetails === 0) {
      details = <div>{this.props.criterion.alert_level.map((level, index) => {
        return <AlertLevel content={level}/>
      })}</div>;
    }
    else {
      details = <div/>;
    }

    if(typeof(this.props.criterion.conditions) == "undefined" ||
        (Object.keys(this.props.criterion.conditions).length === 0 && this.props.criterion.conditions.constructor === Object)) {
      var condition = <div/>;
    }
    else {
      var condition = <Condition
          object = {this.props.criterion.conditions} index = {0}/>;
    }
    var element =
    <div className={s.box} onClick={() => this.handleClick(this.props.criterion)}>
      <div className={s.initialCondition}>
        <span className={s.criterionName}>{this.props.criterion.name}</span> - Initiating Condition:
        <div className={s.criterionDescription} dangerouslySetInnerHTML={{__html: this.props.criterion.description.text}}/>
      </div>
      {details}
    </div>;
    return element;
  }
}

class OverviewTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      conditionNumbers : [],
      view: 0
      //0: detailed grid view
      //1: short grid view
      //2: button view
    }
  }

  componentWillMount() {
    this.setState({view: store.getState().overviewPageStyle});
  }

  createRowData(emergencyCat, content)
  {
    return{
      emergencyLevel : emergencyCat,
      content: content,
    }
  }

  getRecognitionCategoryDataGrid(tableData){
    var emergencyCatArray = ["General Emergency","Site Area Emergency","Alert","Unusual Event"];
    var conditionNumberArray = this.state.conditionNumbers;

    //Add all the rows to this container div
    var rowsData = <div>
      {
        //Loop through the condition numbers
        conditionNumberArray.map((conditionNumber, conditionNumberIndex) => {
          //Add one row for each condition number
          var rowData = <div key={conditionNumber + ":" + conditionNumberIndex} className={s.gridDataRow}><div className="mdl-grid mdl-grid--no-spacing">
          {
          //Loop through the emergency categories
          emergencyCatArray.map((emergencyCategory, emergencyCategoryIndex) => {
            var tableDataCell = tableData[conditionNumberIndex + (((conditionNumberArray.length*emergencyCatArray.length)/emergencyCatArray.length) * emergencyCategoryIndex)];
            var cellContent;
            if(tableDataCell.content === "")
            {
              cellContent =
              <div key={emergencyCategoryIndex} className="mdl-cell mdl-cell--3-col"><div className={s.gridCellEmpty}>

              </div> </div>;
            }
            else {
              cellContent = <div key={emergencyCategoryIndex} className="mdl-cell mdl-cell--3-col"><div className={s.gridCell}>
                <Criterion criterion={tableDataCell.content}  key={emergencyCategoryIndex} emergencyLevel = {tableDataCell.emergencyLevel}
                  showDetails={this.state.view}/>
              </div> </div>;
            }

            return(cellContent);
        })
        //End of the emergency map
        } </div></div>;
        return (rowData);
        })
      }
    </div>;

    return rowsData;
  }

  /**
  * Extracts the condition number from the criterion header name
  * @param {String} criterionName
  * @return {Number} conditionNumber
  */
  getCriterionConditionNumber(criterionName)
  {
    var conditionNumber = parseInt(criterionName.replace(/[^0-9]/g,''));
    return conditionNumber;
  }

  /**
  * Extracts the condition numbers of the emergency categories
  * @param {Object Array} emergencyCategories
  * @return {Integer Array} conditionNumbers
  */
  getConditionNumbers(emergencyCategories)
  {
    var conditionNumbers = [];
    for(var i = 0; i < emergencyCategories.length; i++)
    {
      for(var y = 0; y < emergencyCategories[i].criterions.length; y++)
      {
        if(this.checkIfModeApplicable(emergencyCategories[i].criterions[y]))
        {
          //Find the first occurence of a number inside a string. The first number is the criterion condition number
          var conditionNumber = this.getCriterionConditionNumber(emergencyCategories[i].criterions[y].name);
          if(conditionNumbers.indexOf(conditionNumber) === -1)
          {
            conditionNumbers.push(conditionNumber);
          }
        }
      }
    }

    conditionNumbers.sort();

    return conditionNumbers;
  }

  /**
  * Check if the provided criterion is applicable with the current selected mode configuration
  * @param {Criterion object} criterion
  * @return {Boolean}
  */
  checkIfModeApplicable(criterion){
    var modeApplicable = true;
    if(criterion.content != "")
    {
      var result = criterion.mode_applicability.indexOf(store.getState().mode);
      if(result === -1)
      {
        modeApplicable = false;
      }
    }

    return modeApplicable;
  }

  /**
  * Extracts the conditions of the emergency categories in the selected recognition category. Fills inn missing conditions with empty content.
  * The returned object has the properties
  *   emergencyLevel, the name of the emergency level {String}
  *   content, a Criterion object or an empty string if the emergency level did not have that criterion
  * @return {Object Array} tableData
  */
  getTableData()
  {
    //Get the emergency criterion data of the selected emergency category
    var emergencyCategories = eALDocument.getRecognitionCategoryData(store.getState().recognitionCategory).emergency_categories;

    //Get the condition numbers of the emergency categories
    var conditionNumbers = this.getConditionNumbers(emergencyCategories);
    //Store the found condition numbers for use with the table
    this.state.conditionNumbers = conditionNumbers;

    //Fill the table data and add in empty elements if a emergency category does not have the current criterion condition number
    var tableData = [];

    //Go through every emergency category
    for(var y = 0; y < emergencyCategories.length; y++)
    {
      //Check if the current emergency category has all the criterions between the lowest and highest found criterions.
      for(var i = 0; i < conditionNumbers.length; i++)
      {
        var categoryHasCriterion = false;
        for(var z = 0; z < emergencyCategories[y].criterions.length; z++)
        {
          var criterionNumber = this.getCriterionConditionNumber(emergencyCategories[y].criterions[z].name);
          if(criterionNumber === conditionNumbers[i])
          {
            tableData.push(this.createRowData(emergencyCategories[y].name, emergencyCategories[y].criterions[z]));
            categoryHasCriterion = true;
            break;
          }
        }

        //If the emergency category did not have the criterion we add an empty object to fill the gap in the overview table.
        if(categoryHasCriterion === false)
        {
          tableData.push(this.createRowData(emergencyCategories[y].name, ""));
        }
      }
    }
    return tableData;
  }


  getGridView(recognitionCategoryData) {
    return (
    <div className={s.overviewGridContainer}>
      <div className={s.headerContainer}><div className="mdl-grid mdl-grid--no-spacing">
        <div className="mdl-cell mdl-cell--3-col "><div className={s.headerCell}> General Emergency </div> </div>
        <div className="mdl-cell mdl-cell--3-col "><div className={s.headerCell}> Site Area Emergency </div> </div>
        <div className="mdl-cell mdl-cell--3-col "><div className={s.headerCell}> Alert </div> </div>
        <div className="mdl-cell mdl-cell--3-col "><div className={s.headerCell}> Unusual Event </div> </div>
      </div></div>
      <div className={s.dataContainer}>
        {this.getRecognitionCategoryDataGrid(recognitionCategoryData)}
      </div>
    </div>);
  }

  findCriterion(number) {
    //Get the emergency criterion data of the selected emergency category
    var emergencyCategories = eALDocument.getRecognitionCategoryData(store.getState().recognitionCategory).emergency_categories;

    //Go through every emergency category
    for(var y = 0; y < emergencyCategories.length; y++)
    {
      for(var z = 0; z < emergencyCategories[y].criterions.length; z++)
      {
        var criterionNumber = this.getCriterionConditionNumber(emergencyCategories[y].criterions[z].name);
        if(criterionNumber === number)
        {
          return {
            emergencyCategory: emergencyCategories[y],
            criterion: emergencyCategories[y].criterions[z]
          };
        }
      }
    }
    return null;
  }

  handleButtonClick(number) {
    var clickedItem = this.findCriterion(number);
    var action = {
      type : 'SET_STATE',
      mode : store.getState().mode,
      recognitionCategory : store.getState().recognitionCategory,
      emergencyLevel : clickedItem.emergencyCategory.name,
      criterionObject: clickedItem.criterion
    }
    store.dispatch(action);

    history.push("/classifying");
  }

  getConditionButton(number) {
    return (<Button className={s.buttonStyle} onClick={()=> this.handleButtonClick(number)}>{number}</Button>);
  }

  getButtonView(recognitionCategoryData) {
    //Add all the rows to this container div
    var ele = <div>
      {this.state.conditionNumbers.map((number, index) => {
        return this.getConditionButton(number);
      })}
    </div>;
    return (ele);
  }

  switchView() {
    this.setState({view: (this.state.view + 1) % 3});
    var actionStyle = {
      type: 'SET_OVERVIEW_PAGE_STYLE',
      overviewPageStyle: this.state.view
    }
    store.dispatch(actionStyle);
  }

  render() {
    var recognitionCategoryData = this.getTableData();
    var content;
    if(this.state.view === 0 || this.state.view === 1) { //show full details in grid view
      content = this.getGridView(recognitionCategoryData);
    }
    else {
      content = this.getButtonView(recognitionCategoryData); //show buttons representing each situations
    }

    return(content);
  }
}

export default OverviewTable;
