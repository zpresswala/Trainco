USE [TPCTrainco.Umbraco]
GO

/****** Object:  Table [dbo].[CacheCourseDetail]    Script Date: 3/1/2016 11:26:52 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[CacheCourseDetail](
	[Id] [int] NOT NULL,
	[TopicId] [int] NOT NULL,
	[CourseTier] [int] NOT NULL,
	[Title] [varchar](500) NULL,
	[SubTitle] [varchar](max) NULL,
	[ImageUrl] [varchar](500) NULL,
	[DetailsUrl] [varchar](500) NULL,
	[Price] [float] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO


USE [TPCTrainco.Umbraco]
GO

/****** Object:  Table [dbo].[CacheLocationScheduleDetail]    Script Date: 3/2/2016 12:37:16 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[CacheLocationScheduleDetail](
	[Id] [int] NOT NULL,
	[CourseId] [int] NOT NULL,
	[TopicId] [int] NOT NULL,
	[City] [varchar](100) NULL,
	[StateCode] [varchar](10) NULL,
	[State] [varchar](100) NULL,
	[LocationDetails] [varchar](1000) NULL,
	[Coordinates] [varchar](200) NULL,
	[DateFilter] [datetime] NULL,
	[DateMonthYear] [varchar](100) NULL,
	[Distance] [float] NULL,
	[ParentId] [bigint] NULL,
	[ScheduleSeminarNumber] [varchar](100) NULL,
	[DaysTitle] [varchar](50) NULL,
	[DaysDescription] [varchar](max) NULL,
	[Date] [varchar](100) NULL,
	[Price] [float] NOT NULL,
	[Description] [varchar](max) NULL,
	[SeminarId] [bigint] NULL,
	[SeminarTitle] [varchar](200) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO

