pub struct Ballot {
    pub name: String,
    pub candidates: Candidate[],
}

pub struct Candidate {
    pub order: u32,
    pub name: String,
    pub relateTo: u32,
}

pub struct Item {
    pub id: u32,
    pub name: String,
}
