const CategoryTree = require('../models/categoryTree');
const Link = require('../models/links');

module.exports = {
	getChildrenCategories : (req, res, next) =>{
		let MyId = req.body.categoryId;
		CategoryTree.findOne({
			_id: MyId
		})
		.then((me) => {
			console.log(me.children)
			LinkIds = [];
			for(let i=0; i<me.children.length; i++){
				id.push(me.children[i].childId);
			}
			//이부분은 더미 링크를 넣고 다시 테스트 해 보아야 함.
			Link.find({
			    '_id': { $in: id}
			})
			.then((links) => {
				console.log(links);
			})
		})
		.catch((e) => {
			console.error(e)
		})
	},
	getAllLinks : (req, res, next) =>{
		//특정 클래스로부터 자식 클래스에 이르기까지 하위 모든 클래스의 링크들을 전부 배열로 가져옴.
		let currentCategoryId = req.body.categoryId;
		let returnArray = [];
		CategoryTree.findOne({
			_id : currentCategoryId
		})
		.then(me => {
			returnArray = returnArray.concat(me.links)
			CategoryTree.find({
				'parent.parentId': currentCategoryId
			})
			.then((children)=>{
				console.log(' successfully found All children ')
				for(let i=0; i<children.length; i++){
					console.log(children[i].name);
					returnArray = returnArray.concat(children[i].links)
				}
				console.log(returnArray);
				res.status(200).json(returnArray);
			})
			.catch((e) => {
				console.error('Error :' , e)
			})
		})
		.catch(e => console.log(e));

	},
	getAllCourses : (req, res, next) =>{
		//특정 클래스로부터 자식 클래스에 이르기까지 하위 모든 클래스의 링크들을 전부 배열로 가져옴.
		let currentCategoryId = req.body.categoryId;
		let returnArray = [];

		CategoryTree.findOne({
			_id : currentCategoryId
		})
		.then(me => {
			returnArray = returnArray.concat(me.courses);
			CategoryTree.find({
				'parent.parentId': currentCategoryId
			})
			.then((children)=>{
				console.log(' successfully found All children ')
				for(let i=0; i<children.length; i++){
					console.log(children[i].name);
					returnArray = returnArray.concat(children[i].courses)
				}
				console.log(returnArray);
				res.status(200).json(returnArray);
			})
			.catch((e) => {
				console.error('Error :' , e)
			})
		})
		.catch(e =>console.log(e))

	},
	addCategory : (req, res, next) =>{
		//클래스를 특정 부모 클래스 밑에 붙인다.
		//예 : '자바스크립트' 클래스에 '서버'클래스를 붙이고 싶으면
		//'자바스크립트'클래스 아이디와 '서버'클래스 아이디를 붙이면 됨.
		let parentId = req.body.parentId;
		let newTreeName = req.body.newCategoryName
		let newTreeParent;
		CategoryTree.findOne({
			_id: parentId
		})
		.then((parent) => {
			if(!parent){
				newTreeParent = [];
			}else{
			newTreeParent = parent.parent.slice();
			newTreeParent.push({
					parentId:parent._id,
					name: parent.name
				});
			}
			new CategoryTree({
			name: newTreeName,
			parent: newTreeParent
			})
			.save()
			.catch((e) => {
				return console.error(e);
			})
			.then((newCategory) => {
				console.log('success ',newCategory);
				if(parent){
					parent.children.push({
						childId: newCategory._id,
						name: newCategory.name
					});
					parent.save()
					.then((r)=>{
						res.status(200).json({message:'category saved successfully'});
					})
					.catch((e) =>{
						return console.error('ERROR :saving newCategory\'s id to parent Category\' children array ', e)
					})
				}
			})
		})
		.catch((e) => {
			return console.error('finding error ',e);
		})
	},
	//특정 클래스에 링크를 저장해주는 함수.
	//이를 위해 링크를 추가해줄 클래스의 _id와 link의 _id를 인수로 받는다.
	addLinktoCategory : function (req, res, next){
		let categoryId = req.body.categoryId;
		let linkId = req.body.linkId;
		CategoryTree.findOne({
			_id:categoryId
		})
		.then((result) => {
			if(!result) {
				return console.error('ERROR: NO CATEGORY FOUND WHEN ADDING LINK TO CATEGORY.')
			}else {
				result.children.push(linkId);
				result.save()
				.then(function(result){
					res.status(200).json({message: 'successfully added'});
				})
				.catch( function(e) {
					console.error(e);
				})
			}
		})
	},
	deleteCategoryTree : (req, res, next) => {
		//delete relationship with parent
		//delete all children node.
	}
}

