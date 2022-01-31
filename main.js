async function main() {
    const userObj = new User();
    console.log(await userObj.getAll());
    // await userObj.add("Patrick","Yes","Z@Z");
    // console.log(await userObj.getAll());
}


class User {
    usersRef = db.collection("users");
    seriesRef = db.collection("series");

    async add(name, password, email) {
        const user = { name, password, email};

        try {
            const docRef = await this.usersRef.add(user);
            console.log('User Added with ID: ', docRef.id);
            user.id = docRef.id;

        } catch (error) {
            console.error('Error Adding User: ', error)
        }

        return user;
    }

    async getAll() {
        const users = [];

        // Get series
        try {
            const seriessnapshot = await this.seriesRef.get();
            console.log("All docs: " + seriessnapshot.docs);
            seriessnapshot.forEach(doc => console.log(doc.data()));
            seriessnapshot.forEach(doc => console.log("ID:" + doc.id));
        }
        catch (err) {
            console.error('OOops!', err);
        }

        try {
            const snapshot = await this.usersRef.get()
            snapshot.forEach(doc => {
                users.push({id: doc.id, ...doc.data()});
                console.log(doc.data().Series);
                // console.log(users);
            })
        } catch (err) {
            console.error('Error Getting Users: ', err);
        }

        return users;
    }

    async get(id) {
        let user;

        try {
            let doc = await this.usersRef.doc(id).get();
            
            if(doc.exists) 
                user = {id: doc.id, ...doc.data()};
            else
                console.log('No document found with id: ', id);
        } 
        catch (error) {
            console.error('Error in getting user: ', error);
        }

        return user;
    }

    async delete(id) {
        try {
            await this.usersRef.doc(id).delete();
            console.log('User is deleted with id: ', id);
        } catch (error) {
            console.error('Error in deleting user: ', error);
        }
    }
}

main();