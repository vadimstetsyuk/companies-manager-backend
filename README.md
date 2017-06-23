# companies-manager-backend

|      URL           |    Method     |       Data params       |           Title         |
| ------------------ | ------------- | ----------------------- | ----------------------- |
| api/companies      |      GET      |                         | Get all companies       |
| api/companies      |      POST     | Company                 | Create a new company    |
| api/companies/:id  |      PUT      | Company                 | Update company with :id |
| api/companies/:id  |     DELETE    | Number                  | Delete company with :id |

Examples:

Company: 
{
  "id": [number],
  "parentId": [number],
  "name":[string],
  "earnings": [number],
  "fullEarnings": [number],
  "child": Array<Company>
}
