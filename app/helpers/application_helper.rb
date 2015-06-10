module ApplicationHelper
	def display_rating(post)
		rating = post.get_upvotes.size - post.get_downvotes.size
		thumb = rating >= 0 ? "thumbs-o-up" : "thumbs-o-down"

		fa_icon thumb, text: rating
	end
end
