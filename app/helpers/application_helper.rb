module ApplicationHelper
	def display_rating(post)
		rating = post.get_upvotes.size - post.get_downvotes.size

		fa_icon "heart lg", text: rating
	end
end
