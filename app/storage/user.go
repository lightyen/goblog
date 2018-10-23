package storage

import (
	mgo "github.com/globalsign/mgo"
	bson "github.com/globalsign/mgo/bson"
)

// UserCollectionName represent the user collection name
const UserCollectionName = "user"

// User data presentation
type User struct {
	ID          string  `bson:"_id,omitempty" json:"id,omitempty"`
	Username    string  `bson:"name,omitempty" json:"username,omitempty"`
	Password    *string `bson:"pw,omitempty" json:"password,omitempty"`
	CreatedAt   int64   `bson:"cat,omitempty" json:"created,omitempty"`
	LastLoginAt *int64  `bson:"lat,omitempty" json:"lastlogin,omitempty"`
}

type UserStorage struct {
	session    *mgo.Session
	collection *mgo.Collection
}

func (s *UserStorage) Close() {
	s.session.Close()
}

func (s *UserStorage) Get() (result []User, err error) {
	if s.session == nil {
		return nil, ErrConnectionFailed
	}

	err = s.collection.Find(nil).All(&result)

	if result == nil {
		result = []User{}
	}

	return result, err
}

func (s *UserStorage) GetUser(id string) (result *User, err error) {
	if s.session == nil {
		return nil, ErrConnectionFailed
	}

	selector := bson.M{
		"_id": id,
	}

	result = &User{}

	err = getOneRetry(defaultRetryTimes, s.collection, selector, result)

	return result, err
}
