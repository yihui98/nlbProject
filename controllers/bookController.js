const config = require('../utils/config')
const booksRouter = require('express').Router()

var soap = require('soap')
var url = 'https://openweb.nlb.gov.sg/OWS/CatalogueService.svc?wsdl'

booksRouter.get('/:id', async (request, response) => {
    //console.log(request.params.id)
    const books = Search(request.params.id)
    books.then((result) => {
        return response.json(result)
        
    }).catch((error) => {
        console.log("error")
        console.error(error)
        return response.json([])
    })
})    

booksRouter.get('/SearchTitle/:id', async (request, response) => {
    const books = SearchTitle(request.params.id)
    books.then((result) => {
        return response.json(result)
    })
})    

booksRouter.get('/SearchAvailable/:id', async (request, response) => {
    const books = SearchAvail(request.params.id)
    books.then((result) => {
        return response.json(result)
    })
})    

const Search = (title) => {
	return new Promise((resolve, reject) => {
        let searchArgs = {
            SearchRequest : {
                APIKey: config.API_KEY,
                SearchItems: {
                    SearchItem: {
                        SearchField: "Title",
                        SearchTerms: title
                    }
                },
                Modifiers: {
                    StartRecordPosition: 1,
                    MaximumRecords: 50,
                }
            }
          };
        soap.createClient(url, (err, client) => {
			client["CatalogueService"]["BasicHttpBinding_ICatalogueService"]["Search"](searchArgs.SearchRequest, (err, res) => {
                    if(err){resolve(err)}
                    if (res.Titles){
                        console.log("result", res.Titles.Title)
                        resolve(res.Titles.Title)
                    }
                    else{
                        reject(res.ErrorMessage)
                    }
			})
		})
	})
}

const SearchTitle = (bid) => {
	return new Promise((resolve, reject) => {
        let searchArgs = {
            GetTitleDetailsRequest: {
                APIKey: config.API_KEY,
                BID: bid,
                ISBN: ""
            }
          };
        soap.createClient(url, (err, client) => {
			client["CatalogueService"]["BasicHttpBinding_ICatalogueService"]["GetTitleDetails"](searchArgs.GetTitleDetailsRequest, (err, res) => {
					console.log("result", res)
                    resolve(res.TitleDetail)
			})
		})
	})
}

const SearchAvail = (bid) => {
	return new Promise((resolve, reject) => {
        let searchArgs = {
            GetAvailabilityInfoRequest: {
                APIKey: config.API_KEY,
                BID: bid,
                ISBN: "",
                Modifiers: {}
            }
          };
        soap.createClient(url, (err, client) => {
			client["CatalogueService"]["BasicHttpBinding_ICatalogueService"]["GetAvailabilityInfo"](searchArgs.GetAvailabilityInfoRequest, (err, res) => {
                if(res.Status === "OK" && "Items" in res && "Item" in res.Items && res.Items.Item){
                    resolve (res.Items.Item)
                } else if (res.Status === "OK" && !("ErrorMessage" in res)){
                    resolve([])
                }
			})
		})
	})
}

module.exports = booksRouter