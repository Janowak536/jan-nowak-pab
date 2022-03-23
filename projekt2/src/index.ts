
import express from "express";
import { Request, Response } from "express";

const app = express()

app.use(express.json())

app.get('/', function (req: Request, res: Response) {
  res.send('GET Hello World')
})
app.post('/', function (req: Request, res: Response) {
  console.log(req.body) // e.x. req.body.title 
  res.status(200).send('POST Hello World')
})
interface Note {
  title: string;
  content: string;
  createDate?: string;
  tags?: any[];
  id?: number;
}

let notatka: Note[] = [
  {
    title: "b",
    content: "b",
    createDate: "17-02-2022",
    tags: ["d", "e", "f"],
    id: 2,
  },
  {
    title: "a",
    content: "a",
    createDate: "16-02-2022",
    tags: ["a", "b", "c"],
    id: 1,
  },
];

app.get("/note/:id", function (req: Request, res: Response) {
  var ID = req.params.id;
  const IDnumber = +ID;

  for (var item of notatka) {
    if (item.id == IDnumber && ID != null) {
      res.status(200).send(item);
    } else {
      res.status(404).send("Błąd 404")
    }
  }
});

app.get("/notes", function (req: Request, res: Response) {
  res.send(notatka);
});

app.post("/note", function (req: Request, res: Response) {
  const title = req.body.title;
  const content = req.body.content;
  if (title == null && content == null) {
    res.status(400).send("Błąd 400");
  } else {
    const note = req.body;
    const date = new Date()
    date.toISOString();
    note.date = date
    note.id = Date.now().toString()
    notatka.push(note);
    res.status(200).send(note.id);
  }
});


app.delete("/note/:id", (req, res) => {
  const { id } = req.params;
  const ID = +id;

  notatka = notatka.filter((note) => note.id !== ID);

  res.send("Delete");
});
app.put("/note/:id", (req, res) => {
  const { id } = req.params;
  const ID = +id;

  const { title, content, createDate, tags } = req.body;

  const note = notatka.find((note) => note.id === ID);
  if (note == null) {
    res.status(404).send("błąd 404")
  }else{
    function validateToken(note: any) {
      return note;
    }
  
    validateToken(note as any);
  
    if (title) {
      note!.title = title;
    }
  
    if (content) {
      note!.content = content;
    }
  
    if (createDate) {
      note!.createDate = createDate;
    }
  
    if (tags) {
      note!.tags = tags;
    }
  
    res.send(note);
  }
});
app.listen(3000)