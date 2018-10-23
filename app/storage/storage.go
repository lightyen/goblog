package storage

import (
	"errors"

	mgo "github.com/globalsign/mgo"
	bson "github.com/globalsign/mgo/bson"
)

var (
	// ErrNotFound indicates wanted data is not found.
	ErrNotFound = errors.New("not found")
	// ErrDuplicate indicates writing operation cause duplicate data conflict.
	ErrDuplicate = errors.New("duplicate")
	// ErrConnectionFailed indicates the connection of database is failed.
	ErrConnectionFailed = errors.New("connection failed")
)

// defaultRetryTimes defines the default value of retring times.
const defaultRetryTimes = 1

// Storage represents the mongoDB data storage
type Storage struct {
	session  *mgo.Session
	database *mgo.Database
}

// Close the mongo Storage
func (s *Storage) Close() {
	if s.session != nil {
		s.session.Close()
		s.session = nil
		s.database = nil
	}
}

// New will create mongoDB storage and global session with given information
func New(di *mgo.DialInfo) (*Storage, error) {

	session, err := mgo.DialWithInfo(di)

	if err != nil {
		return nil, err
	}

	return &Storage{
		session:  session,
		database: session.DB(""),
	}, nil
}

// User get the UserStorage (Copy from MainStorage)
func (s *Storage) User() *UserStorage {
	ss := s.session.Copy()
	st := &Storage{
		session:  ss,
		database: ss.DB(""),
	}
	return &UserStorage{
		session:    ss,
		collection: st.database.C(UserCollectionName),
	}
}

// getRetry retries to find t times unit error is not 'EOF' problem.
func get(c *mgo.Collection, selector bson.M, doc interface{}) error {
	err := c.Find(selector).All(doc)
	if err != nil {
		return ErrConnectionFailed
	}
	return err
}

// getOneRetry retries to find t times unit error is not 'EOF' problem.
func getOneRetry(t uint32, c *mgo.Collection, selector bson.M, doc interface{}) error {
	var err error

	for {
		err = c.Find(selector).One(doc)
		if err != nil && err.Error() == "EOF" {
			if t > 0 {
				c.Database.Session.Refresh()
				t--
				continue
			}
			return ErrConnectionFailed
		}
		break
	}

	if err == mgo.ErrNotFound {
		return ErrNotFound
	}
	return err
}

// insertRetry retries to insert t times unit error is not 'EOF' problem.
func insertRetry(t uint32, c *mgo.Collection, docs ...interface{}) error {
	var err error

	for {
		err = c.Insert(docs...)
		if err != nil && err.Error() == "EOF" {
			if t > 0 {
				c.Database.Session.Refresh()
				t--
				continue
			}
			return ErrConnectionFailed
		}
		break
	}

	if mgo.IsDup(err) {
		return ErrDuplicate
	}
	return err
}

// updateRetry retries to update or insert t times unit error is not 'EOF' problem.
func updateRetry(t uint32, c *mgo.Collection, selector, update interface{}) error {
	var err error

	for {
		err = c.Update(selector, update)
		if err != nil && err.Error() == "EOF" {
			if t > 0 {
				c.Database.Session.Refresh()
				t--
				continue
			}
			return ErrConnectionFailed
		}
		break
	}

	if err == mgo.ErrNotFound {
		return ErrNotFound
	}
	return err
}

// removeRetry retries to remove t times unit error is not 'EOF' problem.
func removeRetry(t uint32, c *mgo.Collection, selector interface{}) error {
	var err error

	for {
		err = c.Remove(selector)
		if err != nil && err.Error() == "EOF" {
			if t > 0 {
				c.Database.Session.Refresh()
				t--
				continue
			}
			return ErrConnectionFailed
		}
		break
	}

	if err == mgo.ErrNotFound {
		return ErrNotFound
	}
	return err
}
