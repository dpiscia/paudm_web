from sqlalchemy import create_engine
from sqlalchemy.types import Integer, String
from sqlalchemy.orm import  sessionmaker, scoped_session
from sqlalchemy import PrimaryKeyConstraint, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import MetaData, Column, DateTime, Boolean


Base = declarative_base()
metadata      = Base.metadata
session       = None
tables        = {}
mappers       = {}

_salt = 'djhferuyunniurnlp097jlknf8holanhgnhhrf'

def init(url):
    """
    Initialize the tables, mapping classes and establish a session with the DB
    
    @param url: Configuration URL for the SQLAlchemy engine
    @type url: str
    """
    global session
    

        
    engine = create_engine(url, connect_args={'check_same_thread':False})
    metadata.bind = engine
    session = scoped_session(sessionmaker(bind=engine))()
    
    
    return session
    
    
def recreate():
    # Drop and recreate the database
    metadata.drop_all()
    metadata.create_all()

            
class User(Base):
    __tablename__ = 'user'
    __table_args__ = (
        # Primary key
        PrimaryKeyConstraint('id'),
        # Unique key
        UniqueConstraint('email'),
    )
    # Columns
    id        = Column(Integer,     nullable=False  )
    login     = Column(String(32),  nullable=False )
    email     = Column(String(64),  nullable=False)
    password  = Column(String(64),  nullable=False  )

    # Flask-Login integration
    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.id

    # Required for administrative interface
    def __unicode__(self):
        return self.username

