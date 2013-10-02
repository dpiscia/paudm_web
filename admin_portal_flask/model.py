from sqlalchemy import create_engine
from sqlalchemy.types import Integer, String
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy import PrimaryKeyConstraint, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import MetaData, Column, DateTime, Boolean


Base = declarative_base()
metadata = Base.metadata
session = None
tables = {}
mappers = {}

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
    __tablename__ = 'User'
    __table_args__ = (
        # Primary key
        PrimaryKeyConstraint('id'),
        # Unique key
        UniqueConstraint('email'),
    )
    # Columns
    id = Column(Integer, nullable=False )
    email = Column(String(32), nullable=False )
    name = Column(String(64), nullable=False)
    surname = Column(String(64), nullable=False )
    institution = Column(String(64), nullable=False)
    arrival_datetime = Column(DateTime, nullable=False)
    arrival_busoption = Column(Integer, nullable=False)
    arrival_bus_morning = Column(Integer, nullable=True)
    arrival_bus_afternoon = Column(Integer, nullable=True)
    vegeterian = Column(Boolean, nullable=False)
    student = Column(Boolean, nullable=False)
    hotel = Column(Integer, nullable=False)
    Occupancy = Column(Integer, nullable=True)
    Double_use = Column(Integer, nullable=True)
    Gender_double_use = Column(Integer, nullable=True)
    Proposed_name = Column(String(64), nullable=True)
    departure_datetime = Column(DateTime, nullable=False)
    departure_busoption = Column(Integer, nullable=False)
    departure_bus = Column(Integer, nullable=True)
    paid = Column(Boolean, nullable=True, default = False)
